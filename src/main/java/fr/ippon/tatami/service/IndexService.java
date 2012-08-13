package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
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
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.inject.Inject;
import java.io.IOException;
import java.util.*;

/**
 * @author dmartinpro
 */
@Service
public class IndexService {

    private static final Log log = LogFactory.getLog(IndexService.class);

    private static final String ALL_FIELDS = "_all";

    @Inject
    private Client client;

    @Inject
    private String indexName;

    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Add a status to the index.
     *
     * @param status the status to add : can't be null
     * @return the response's Id
     */
    @Async
    public String addStatus(final Status status) {
        Assert.notNull(status, "status can't be null");

        XContentBuilder jsonifiedObject = null;
        try {
            jsonifiedObject = XContentFactory.jsonBuilder()
                    .startObject()
                    .field("username", status.getUsername())
                    .field("domain", status.getDomain())
                    .field("statusDate", status.getStatusDate())
                    .field("content", StringEscapeUtils.unescapeHtml(status.getContent()))
                    .endObject();
        } catch (IOException e) {
            log.error("The status wasn't added to the index: "
                    + status.getStatusId()
                    + " ["
                    + status.toString()
                    + "]", e);
            return null;
        }

        return addObject(status.getClass(), status.getStatusId(), jsonifiedObject);
    }

    /**
     * Delete a status from the index.
     *
     * @param status the status to delete
     * @return the response's Id
     */
    public String removeStatus(final Status status) {
        Assert.notNull(status, "status can't be null");
        return removeObject(status.getClass(), status.getStatusId());
    }

    /**
     * Search an item in the index.
     *
     * @param clazz     the item type : mandatory
     * @param field     a particular field to search into
     * @param query     the query : mandatory
     * @param page      the page to return
     * @param size      the size of a page
     * @param sortField which field should be used to sort the results
     * @param sortOrder which order to apply, ASC if not provided
     * @return a list of uid
     */
    public Map<String, String> search(@SuppressWarnings("rawtypes") final String domain, final Class clazz, final String field,
                                      final String query, int page, int size, final String sortField, final String sortOrder) {

        Assert.notNull(clazz);
        Assert.notNull(query);
        Assert.notNull(domain);

        if (page < 0) {
            page = 0; //Default value
        }
        if (size <= 0) {
            size = 20; //Default value
        }


        final String name = (StringUtils.isBlank(field) ? ALL_FIELDS : field);
        final QueryBuilder qb = QueryBuilders.textQuery(name, query);
        final String dataType = clazz.getSimpleName().toLowerCase();
        final FilterBuilder domainFilter = new TermFilterBuilder("domain", domain);

        SearchResponse searchResponse = null;
        try {
            SearchRequestBuilder builder = this.client.prepareSearch(this.indexName)
                    .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
                    .setQuery(qb)
                    .setFilter(domainFilter)
                    .setTypes(dataType)
                    .setFrom(page * size).setSize(size).setExplain(false);
            if (StringUtils.isNotBlank(sortField)) {
                builder.addSort(sortField, ("desc".equalsIgnoreCase(sortOrder)) ? SortOrder.DESC : SortOrder.ASC);
            }

            searchResponse = builder.execute().actionGet();
        } catch (IndexMissingException e) {
            log.warn("The index was not found in the cluster.");
            return new HashMap<String, String>(0);
        }

        final SearchHits searchHits = searchResponse.getHits();
        final Long hitsNumber = searchHits.getTotalHits();
        if (hitsNumber == 0) {
            return new HashMap<String, String>(0);
        }

        final SearchHit[] searchHitsArray = searchHits.getHits();
        final Map<String, String> items = new LinkedHashMap<String, String>(hitsNumber.intValue());
        for (int i = 0; i < searchHitsArray.length; i++) {
            items.put(searchHitsArray[i].getId(), null);
        }

        return items;
    }

    /**
     * Search an item in the index.
     *
     * @param clazz       the item type
     * @param searchField a particular field to search into, if null, "_all" field is used
     * @param uidField    : the field to return in the results collection
     * @param query       the query
     * @param page        the page to return
     * @param size        the size of a page
     * @return a list of uid
     */
    @SuppressWarnings("unchecked")
    public <T> List<String> searchPrefix(final String domain, final Class<T> clazz, final String searchField, final String uidField, final String query, int page, int size) {

        Assert.notNull(clazz);
        Assert.notNull(domain);

        final String name = (StringUtils.isBlank(searchField) ? ALL_FIELDS : searchField);
        final QueryBuilder qb = QueryBuilders.prefixQuery(name, query);
        final String dataType = clazz.getSimpleName().toLowerCase();
        final FilterBuilder domainFilter = new TermFilterBuilder("domain", domain);

        SearchResponse searchResponse = null;
        try {
            searchResponse = this.client.prepareSearch(this.indexName)
                    .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
                    .setQuery(qb)
                    .setFilter(domainFilter)
                    .setTypes(dataType)
                    .setFrom(page * size).setSize(size).setExplain(false)
                    .addSort(SortBuilders.fieldSort(uidField).order(SortOrder.ASC))
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
        final List<String> items = new ArrayList<String>(hitsNumber.intValue());
        Map<String, Object> item = null;
        try {
            for (int i = 0; i < searchHitsArray.length; i++) {
                item = this.mapper.readValue(searchHitsArray[i].source(), Map.class);
                items.add((String) item.get(uidField));
            }
        } catch (JsonParseException e) {
            e.printStackTrace();
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return items;
    }

    /**
     * Add a user to the index.
     *
     * @param user the user to add : can't be null
     * @return the response's Id
     */
    @Async
    public String addUser(final User user) {
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
        } catch (IOException e) {
            log.error("The user wasn't added to the index: "
                    + user.getLogin()
                    + " ["
                    + user.toString()
                    + "]", e);
            return null;
        }

        return addObject(user.getClass(), user.getLogin(), jsonifiedObject);
    }

    /**
     * Add an item to the index.
     *
     * @param clazz           the item class
     * @param uid             the item identifier
     * @param jsonifiedObject the item json representation
     * @return the response's Id
     */
    private String addObject(@SuppressWarnings("rawtypes") final Class clazz, String uid, XContentBuilder jsonifiedObject) {

        if (log.isDebugEnabled()) {
            String itemAsString = null;
            try {
                itemAsString = jsonifiedObject.prettyPrint().string();
            } catch (IOException e) {
                itemAsString = clazz.getSimpleName() + "-" + uid;
            }
            log.debug("Ready to inject this json object into Elastic Search: " + itemAsString);
        }

        final String dataType = clazz.getSimpleName().toLowerCase();
        IndexResponse response = this.client.prepareIndex(this.indexName, dataType, uid)
                .setSource(jsonifiedObject)
                .execute()
                .actionGet();

        // Should we force the update ? Not sure... due to performance cost. "index.refresh_interval" properties may be adjusted if needed
        // client.admin().indices().refresh(Requests.refreshRequest(indexName)).actionGet();

        return (response == null) ? null : response.getId();
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
