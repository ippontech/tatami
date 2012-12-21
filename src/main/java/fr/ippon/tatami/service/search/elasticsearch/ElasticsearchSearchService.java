package fr.ippon.tatami.service.search.elasticsearch;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.SearchService;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.index.query.FilterBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermFilterBuilder;
import org.elasticsearch.indices.IndexMissingException;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.util.Assert;

import javax.inject.Inject;
import java.io.IOException;
import java.util.*;

public class ElasticsearchSearchService implements SearchService {

    private static final Log log = LogFactory.getLog(ElasticsearchSearchService.class);

    private static final String ALL_FIELDS = "_all";

    @Inject
    private Client client;

    @Inject
    private String indexName;

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public boolean reset() {
        DeleteIndexResponse delete = client.admin().
                indices().delete(new DeleteIndexRequest(this.indexName)).actionGet();

        if (!delete.acknowledged()) {
            log.error("Search engine Index wasn't deleted !");
            return false;
        } else {
            return true;
        }
    }

    @Override
    @Async
    public void addStatus(final Status status) {
        try {
            internalAddStatus(status);
        } catch (IOException e) {
            log.error("The status wasn't added to the index: "
                    + status.getStatusId()
                    + " ["
                    + status.toString()
                    + "]", e);
        }
    }

    @Override
    public void addStatuses(Collection<Status> statuses) {
        try {
            for (Status status : statuses) {
                internalAddStatus(status);
            }
            log.info(statuses.size() + " statuses indexed!");
        } catch (IOException e) {
            log.error("Batch status insert failed ! ", e);
        }
    }

    private void internalAddStatus(Status status) throws IOException {
        XContentBuilder jsonifiedObject;

        jsonifiedObject = XContentFactory.jsonBuilder()
                .startObject()
                .field("username", status.getUsername())
                .field("domain", status.getDomain())
                .field("statusDate", status.getStatusDate())
                .field("content", status.getContent())
                .endObject();

        addObject(status.getClass(), status.getStatusId(), jsonifiedObject);
    }

    @Override
    public void removeStatus(final Status status) {
        Assert.notNull(status, "status can't be null");
        removeObject(status.getClass(), status.getStatusId());
    }

    @Override
    public Map<String, SharedStatusInfo> searchStatus(final String domain,
                                                      final String query,
                                                      int page,
                                                      int size) {

        Assert.notNull(query);
        Assert.notNull(domain);

        if (page < 0) {
            page = 0; //Default value
        }
        if (size <= 0) {
            size = SearchService.DEFAULT_PAGE_SIZE;
        }

        String name = ALL_FIELDS;
        QueryBuilder qb = QueryBuilders.matchQuery(name, query);
        String dataType = Status.class.getSimpleName().toLowerCase();
        FilterBuilder domainFilter = new TermFilterBuilder("domain", domain);

        SearchResponse searchResponse = null;
        try {
            SearchRequestBuilder builder = this.client.prepareSearch(this.indexName)
                    .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
                    .setQuery(qb)
                    .setFilter(domainFilter)
                    .setTypes(dataType)
                    .setFrom(page * size).setSize(size)
                    .setExplain(false);

            builder.addSort("statusDate", SortOrder.DESC);

            searchResponse = builder.execute().actionGet();
        } catch (IndexMissingException e) {
            log.warn("The index was not found in the cluster.");
            return new HashMap<String, SharedStatusInfo>(0);
        }

        final SearchHits searchHits = searchResponse.getHits();
        final Long hitsNumber = searchHits.getTotalHits();
        if (hitsNumber == 0) {
            return new HashMap<String, SharedStatusInfo>(0);
        }

        final SearchHit[] searchHitsArray = searchHits.getHits();
        final Map<String, SharedStatusInfo> items =
                new LinkedHashMap<String, SharedStatusInfo>(hitsNumber.intValue());

        for (int i = 0; i < searchHitsArray.length; i++) {
            items.put(searchHitsArray[i].getId(), null);
        }

        return items;
    }

    @Override
    @Async
    public void addUser(final User user) {
        Assert.notNull(user, "user can't be null");

        XContentBuilder jsonifiedObject;
        try {
            jsonifiedObject = XContentFactory.jsonBuilder()
                    .startObject()
                    .field("login", user.getLogin())
                    .field("username", user.getUsername())
                    .field("domain", user.getDomain())
                    .field("firstName", user.getFirstName())
                    .field("lastName", user.getLastName())
                    .endObject();

            addObject(user.getClass(), user.getLogin(), jsonifiedObject);
        } catch (IOException e) {
            log.error("The user wasn't added to the index: "
                    + user.getLogin()
                    + " ["
                    + user.toString()
                    + "]", e);
        }
    }

    @Override
    public void addUsers(Collection<User> users) {
        for (User user : users) {
            addUser(user);
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public Collection<String> searchUserByPrefix(String domain, String prefix) {
        QueryBuilder qb = QueryBuilders.prefixQuery("username", prefix);
        String dataType = User.class.getSimpleName().toLowerCase();
        FilterBuilder domainFilter = new TermFilterBuilder("domain", domain);

        SearchResponse searchResponse;
        try {
            searchResponse = this.client.prepareSearch(this.indexName)
                    .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
                    .setQuery(qb)
                    .setFilter(domainFilter)
                    .setTypes(dataType)
                    .setFrom(0).setSize(DEFAULT_TOP_N_SEARCH_USER).setExplain(false)
                    .addSort(SortBuilders.fieldSort("username").order(SortOrder.ASC))
                    .execute()
                    .actionGet();
        } catch (IndexMissingException e) {
            log.warn("The index was not found in the cluster.");
            return new ArrayList<String>(0);
        }

        final SearchHits searchHits = searchResponse.getHits();
        final Long hitsNumber = searchHits.getTotalHits();
        if (hitsNumber == 0) {
            return new ArrayList<String>(0);
        }

        final SearchHit[] searchHitsArray = searchHits.getHits();
        final List<String> logins = new ArrayList<String>(hitsNumber.intValue());
        Map<String, Object> user = null;
        try {
            String username = null;
            String login = null;
            for (int i = 0; i < searchHitsArray.length; i++) {
                user = this.mapper.readValue(searchHitsArray[i].source(), Map.class);
                username = (String) user.get("username");
                login = DomainUtil.getLoginFromUsernameAndDomain(username, domain);
                logins.add(login);
            }
        } catch (JsonParseException e) {
            log.error("Json parse exception", e);
        } catch (JsonMappingException e) {
            log.error("Json mapping exception", e);
        } catch (IOException e) {
            log.error("IO exception", e);
        }

        return logins;
    }

    @Override
    public void removeUser(User user) {
        //TODO
    }

    @Override
    public void addGroup(Group group) {
        //TODO
    }

    @Override
    public Collection<Group> searchGroupByPrefix(String domain, String prefix, int size) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public void removeGroup(Group group) {
        //TODO
    }

    /**
     * Add an item to the index.
     *
     * @param clazz           the item class
     * @param uid             the item identifier
     * @param jsonifiedObject the item json representation
     * @return the response's Id
     */
    private void addObject(@SuppressWarnings("rawtypes") final Class clazz, String uid, XContentBuilder jsonifiedObject) {
        if (log.isDebugEnabled()) {
            String itemAsString;
            try {
                itemAsString = jsonifiedObject.prettyPrint().string();
            } catch (IOException e) {
                itemAsString = clazz.getSimpleName() + "-" + uid;
            }
            log.debug("Ready to inject this json object into Elastic Search: " + itemAsString);
        }

        final String dataType = clazz.getSimpleName().toLowerCase();
        client.prepareIndex(this.indexName, dataType, uid)
                .setSource(jsonifiedObject)
                .execute()
                .actionGet();

    }

    /**
     * Delete a object from the index.
     *
     * @param clazz the item class
     * @param uid   : the item identifier
     * @return the response's Id
     */
    private String removeObject(@SuppressWarnings("rawtypes") final Class clazz, String uid) {

        final String dataType = clazz.getSimpleName().toLowerCase();
        if (log.isDebugEnabled()) {
            log.debug("Removing a " + dataType + " item from the index : #" + uid);
        }
        final DeleteResponse response = this.client.delete(new DeleteRequest(this.indexName, dataType, uid)).actionGet();
        return response.getId();
    }
}
