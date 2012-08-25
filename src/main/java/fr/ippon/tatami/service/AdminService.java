package fr.ippon.tatami.service;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.Domain;
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
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexResponse;
import org.elasticsearch.client.Client;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.Collection;
import java.util.List;

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
    private Keyspace keyspaceOperator;

    @Inject
    private Client elasticSearchClient;

    @Inject
    private String indexName;

    public Collection<Domain> getAllDomains() {
        return domainRepository.getAllDomains();
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
        }  else {
            log.error("An error has occured while deleting the Search Engine Index. " +
                    "Full rebuild of the index cancelled.");

            return;
        }

        //Rebuild the user Index
        log.debug("Rebuilding the user Index");
        Collection<Domain> domains = domainRepository.getAllDomains();
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
                for (String login : logins) {
                    User user = userRepository.findUserByLogin(login);
                    log.debug("Indexing user : " + user);
                    searchService.addUser(user); // This should be batched for optimum performance
                }
                log.info("The search engine should index " + logins.size() + " users.");
            }
        }

        //Rebuild the status Index
        log.debug("Rebuilding the status Index");
        String startKey = null;
        boolean moreStatus = true;
        while (moreStatus) {
            RangeSlicesQuery<String, String, String> query = createRangeSlicesQuery(keyspaceOperator,
                    StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                    .setColumnFamily(STATUS_CF)
                    .setRange(startKey, null, false, 0)
                    .setRowCount(1001);

            QueryResult<OrderedRows<String, String, String>> result = query.execute();
            List<Row<String, String, String>> rows = result.get().getList();
            if (rows.size() == 1001) { // Calculate the pagination
                startKey = rows.get(1000).getKey();
                rows = rows.subList(0, 1000);
            } else {
                moreStatus = false;
            }
            for (Row<String, String, String> row : rows) {
                Status status = statusRepository.findStatusById(row.getKey()); // This makes 2 calls to the same row
                searchService.addStatus(status); // This should be batched for optimum performance
            }
            log.info("The search engine should index " + rows.size() + " statuses.");
        }
        log.info("Search engine index rebuilt.");
    }

}
