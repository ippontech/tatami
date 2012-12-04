package fr.ippon.tatami.service;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.Domain;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.repository.StatusRepository;
import fr.ippon.tatami.repository.UserRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.OrderedRows;
import me.prettyprint.hector.api.beans.Row;
import me.prettyprint.hector.api.query.QueryResult;
import me.prettyprint.hector.api.query.RangeSlicesQuery;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.*;

import static fr.ippon.tatami.config.ColumnFamilyKeys.STATUS_CF;
import static me.prettyprint.hector.api.factory.HFactory.createRangeSlicesQuery;

/**
 * Administration service. Only users with the "admin" role should access it.
 *
 * @author Julien Dubois
 */
@Service
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminService {

    private static final Log log = LogFactory.getLog(AdminService.class);

    @Inject
    private DomainRepository domainRepository;

    @Inject
    private SearchService searchService;

    @Inject
    private UserRepository userRepository;

    @Inject
    private StatusRepository statusRepository;

    @Inject
    private GroupService groupService;

    @Inject
    private Environment env;

    @Inject
    private Keyspace keyspaceOperator;

    public Collection<Domain> getAllDomains() {
        return domainRepository.getAllDomains();
    }

    public Map<String, String> getEnvProperties() {
        Map<String, String> properties = new LinkedHashMap<String, String>();
        properties.put("tatami.version", env.getProperty("tatami.version"));
        properties.put("tatami.wro4j.enabled", env.getProperty("tatami.wro4j.enabled"));
        properties.put("tatami.google.analytics.key", env.getProperty("tatami.google.analytics.key"));
        properties.put("tatami.message.reloading.enabled", env.getProperty("tatami.message.reloading.enabled"));
        properties.put("smtp.host", env.getProperty("smtp.host"));
        properties.put("cassandra.host", env.getProperty("cassandra.host"));
        properties.put("search.engine", env.getProperty("search.engine"));
        properties.put("lucene.path", env.getProperty("lucene.path"));
        properties.put("elasticsearch.indexName", env.getProperty("elasticsearch.indexName"));
        properties.put("elasticsearch.cluster.name", env.getProperty("elasticsearch.cluster.name"));
        properties.put("elasticsearch.cluster.nodes", env.getProperty("elasticsearch.cluster.nodes"));
        properties.put("elasticsearch.cluster.default.communication.port", env.getProperty("elasticsearch.cluster.default.communication.port"));
        return properties;
    }

    /**
     * Rebuilds the Search Engine Index.
     * <p>
     * This could be a huge batch process : it does not use a Repository for performance reasons.
     * </p>
     */
    public void rebuildIndex() {
        log.info("Search engine Index rebuild triggered.");
        log.debug("Deleting Index");
        if (searchService.reset()) {
            log.info("Search engine Index deleted.");
        } else {
            log.error("An error has occured while deleting the Search Engine Index. " +
                    "Full rebuild of the index cancelled.");

            return;
        }

        //Rebuild the user Index
        log.debug("Rebuilding the user & group Indexes");
        long fullIndexStartTime = Calendar.getInstance().getTimeInMillis();
        Collection<Domain> domains = domainRepository.getAllDomains();
        int groupCount = 0;
        for (Domain domain : domains) {
            int paginationId = 0;
            boolean moreUsers = true;
            while (moreUsers) {
                List<String> logins = domainRepository.getLoginsInDomain(domain.getName(), paginationId);
                if (logins.size() <= Constants.PAGINATION_SIZE) {
                    moreUsers = false;
                } else {
                    logins = logins.subList(0, Constants.PAGINATION_SIZE);
                }
                paginationId += Constants.PAGINATION_SIZE;
                Collection<User> users = new ArrayList<User>();
                for (String login : logins) {
                    User user = userRepository.findUserByLogin(login);
                    users.add(user);
                    Collection<Group> groups = groupService.getGroupsWhereUserIsAdmin(user);
                    for (Group group : groups) {
                        searchService.addGroup(group);
                        groupCount++;
                    }
                }
                searchService.addUsers(users);
                log.info("The search engine indexed " + logins.size() + " users.");
            }
        }
        log.info("The search engine indexed " + groupCount + " groups.");

        //Rebuild the status Index
        log.info("Rebuilding the status Index");
        String startKey = null;
        boolean moreStatus = true;
        while (moreStatus) {
            long startTime = Calendar.getInstance().getTimeInMillis();
            RangeSlicesQuery<String, String, String> query = createRangeSlicesQuery(keyspaceOperator,
                    StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                    .setColumnFamily(STATUS_CF)
                    .setRange("statusId", "statusId", false, 1)
                    .setKeys(startKey, null)
                    .setRowCount(1001);

            QueryResult<OrderedRows<String, String, String>> result = query.execute();
            List<Row<String, String, String>> rows = result.get().getList();
            if (rows.size() == 1001) { // Calculate the pagination
                startKey = rows.get(1000).getKey();
                rows = rows.subList(0, 1000);
            } else {
                moreStatus = false;
            }
            Collection<Status> statuses = new ArrayList<Status>();
            for (Row<String, String, String> row : rows) {
                Status status = statusRepository.findStatusById(row.getKey()); // This makes 2 calls to the same row
                if (status != null) {  // if a status has been removed, it is returned as null
                    if (status.getStatusPrivate() == null || status.getStatusPrivate() == false) {
                        statuses.add(status);
                    }
                }
            }
            searchService.addStatuses(statuses); // This should be batched for optimum performance
            log.info("The search engine indexed " + rows.size() + " rows in " + (Calendar.getInstance().getTimeInMillis() - startTime) + " ms.");
        }
        log.info("Search engine index rebuilt in " + (Calendar.getInstance().getTimeInMillis() - fullIndexStartTime) + " ms.");
    }

}
