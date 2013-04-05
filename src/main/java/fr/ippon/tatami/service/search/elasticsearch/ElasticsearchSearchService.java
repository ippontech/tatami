package fr.ippon.tatami.service.search.elasticsearch;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.GroupDetailsRepository;
import fr.ippon.tatami.service.SearchService;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.io.Charsets;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.ElasticSearchException;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexRequestBuilder;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.index.query.FilterBuilder;
import org.elasticsearch.index.query.FilterBuilders;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermFilterBuilder;
import org.elasticsearch.indices.IndexMissingException;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.util.Assert;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.IOException;
import java.net.URL;
import java.util.*;

import static org.elasticsearch.common.settings.ImmutableSettings.settingsBuilder;
import static org.elasticsearch.index.query.FilterBuilders.termFilter;
import static org.elasticsearch.index.query.QueryBuilders.prefixQuery;

public class ElasticsearchSearchService implements SearchService {

    private static final Log log = LogFactory.getLog(ElasticsearchSearchService.class);

    private static final String ALL_FIELDS = "_all";
    public static final List<String> TYPES = Collections.unmodifiableList(Arrays.asList("user", "status", "group"));

    @Inject
    private ElasticsearchEngine engine;

    @Inject
    private String indexName;

    @Inject
    private GroupDetailsRepository groupDetailsRepository;


    private final ObjectMapper mapper = new ObjectMapper();

    private Client client() {
        return engine.client();
    }

    @PostConstruct
    private void init() {
        if (!client().admin().indices().prepareExists(indexName).execute().actionGet().exists()) {
            log.info("Index " + indexName + " does not exists in Elasticsearch, creating it!");
            createIndex();
        }
    }

    @Override
    public boolean reset() {
        return deleteIndex() ? createIndex() : false;
    }


    /**
     * Delete the tatami index.
     *
     * @return {@code true} if the index is deleted or didn't exist.
     */
    private boolean deleteIndex() {
        try {
            boolean ack = client().admin().indices().prepareDelete(indexName).execute().actionGet().acknowledged();
            if (!ack)
                log.error("Search engine Index wasn't deleted !");
            return ack;

        } catch (IndexMissingException e) {
            log.warn("Elasticsearch index " + indexName + " missing, it was not deleted");
            return true; // Failling to delete a missing index is supposed to be valid

        } catch (ElasticSearchException e) {
            log.error("Elasticsearch index " + indexName + " was not deleted", e);
            return false;
        }
    }

    /**
     * Create the tatami index.
     *
     * @return {@code true} if an error occurs during the creation.
     */
    private boolean createIndex() {
        try {
            CreateIndexRequestBuilder createIndex = client().admin().indices().prepareCreate(indexName);
            createIndex.setSettings(settingsBuilder().loadFromClasspath("META-INF/elasticsearch/index/tatami.json"));

            for (String type : TYPES) {
                URL mappingUrl = getClass().getClassLoader().getResource("META-INF/elasticsearch/index/tatami/" + type + ".json");
                String mapping = IOUtils.toString(mappingUrl, Charsets.UTF_8);
                createIndex.addMapping(type, mapping);
            }

            boolean ack = createIndex.execute().actionGet().acknowledged();
            if (!ack)
                log.error("Cannot create index " + indexName);
            return ack;

        } catch (ElasticSearchException e) {
            log.error("Cannot create index " + indexName, e);
            return false;

        } catch (IOException e) {
            log.error("Cannot create index " + indexName, e);
            return false;
        }
    }

    private final ElasticsearchMapper<Status> statusMapper = new ElasticsearchMapper<Status>() {
        @Override
        public String id(Status status) {
            return status.getStatusId();
        }

        @Override
        public String type() {
            return "status";
        }

        @Override
        public String prefixSearchField() {
            return null;
        }

        @Override
        public XContentBuilder toJson(Status status) throws IOException {
            XContentBuilder source = XContentFactory.jsonBuilder()
                    .startObject()
                    .field("username", status.getUsername())
                    .field("domain", status.getDomain())
                    .field("statusDate", status.getStatusDate())
                    .field("content", status.getContent());

            if (status.getGroupId() != null) {
                Group group = groupDetailsRepository.getGroupDetails(status.getGroupId());
                source.field("groupId", status.getGroupId());
                source.field("publicGroup", group.isPublicGroup());
            }
            return source.endObject();
        }
    };

    @Override
    @Async
    public void addStatus(Status status) {
        index(status, statusMapper);
    }

    @Override
    public void addStatuses(Collection<Status> statuses) {
        indexAll(statuses, statusMapper);
    }


    @Override
    public void removeStatus(Status status) {
        Assert.notNull(status, "status cannot be null");
        delete(status, statusMapper);
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
            SearchRequestBuilder builder = client().prepareSearch(this.indexName)
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

    private final ElasticsearchMapper<User> userMapper = new ElasticsearchMapper<User>() {
        @Override
        public String id(User user) {
            return user.getLogin();
        }

        @Override
        public String type() {
            return "user";
        }

        @Override
        public String prefixSearchField() {
            return "username";
        }

        @Override
        public XContentBuilder toJson(User user) throws IOException {
            return XContentFactory.jsonBuilder()
                    .startObject()
                    .field("domain", user.getDomain())
                    .field("login", user.getLogin())
                    .field("username", user.getUsername())
                    .endObject();
        }
    };

    @Override
    @Async
    public void addUser(final User user) {
        Assert.notNull(user, "user cannot be null");
        index(user, userMapper);
    }

    @Override
    public void addUsers(Collection<User> users) {
        indexAll(users, userMapper);
    }

    @Override
    public void removeUser(User user) {
        delete(user, userMapper);
    }


    @Override
    @Cacheable("user-prefix-cache")
    public Collection<String> searchUserByPrefix(String domain, String prefix) {
        return searchByPrefix(domain, prefix, DEFAULT_TOP_N_SEARCH_USER, userMapper);
    }


    private final ElasticsearchMapper<Group> groupMapper = new ElasticsearchMapper<Group>() {
        @Override
        public String id(Group group) {
            return group.getGroupId();
        }

        @Override
        public String type() {
            return "group";
        }

        @Override
        public String prefixSearchField() {
            return "name-not-analyzed";
        }

        @Override
        public XContentBuilder toJson(Group group) throws IOException {
            return XContentFactory.jsonBuilder()
                    .startObject()
                    .field("domain", group.getDomain())
                    .field("groupId", group.getGroupId())
                    .field("name", group.getName())
                    .field("description", group.getDescription())
                    .endObject();
        }
    };

    @Override
    @Async
    public void addGroup(Group group) {
        index(group, groupMapper);
    }

    @Override
    public void removeGroup(Group group) {
        delete(group, groupMapper);
    }

    @Override
    @Cacheable("group-prefix-cache")
    public Collection<Group> searchGroupByPrefix(String domain, String prefix, int size) {
        Collection<String> ids = searchByPrefix(domain, prefix, size, groupMapper);
        List<Group> groups = new ArrayList<Group>(ids.size());
        for (String id : ids) {
            groups.add(groupDetailsRepository.getGroupDetails(id));
        }
        return groups;
    }


    /**
     * Indexes an object to elasticsearch.
     * This method is asynchronous.
     *
     * @param object Object to index.
     * @param mapper Converter to JSON.
     */
    private <T> void index(T object, ElasticsearchMapper<T> mapper) {
        Assert.notNull(object);
        Assert.notNull(mapper);

        final String type = mapper.type();
        final String id = mapper.id(object);
        try {
            final XContentBuilder source = mapper.toJson(object);

            if (log.isDebugEnabled()) {
                log.debug("Ready to index the " + type + " of id " + id + " into Elasticsearch: " + stringify(source));
            }
            client().prepareIndex(indexName, type, id).setSource(source).execute(new ActionListener<IndexResponse>() {
                @Override
                public void onResponse(IndexResponse response) {
                    if (log.isDebugEnabled()) {
                        log.debug(type + " of id " + id + " was " + (response.version() == 1 ? "indexed" : "updated") + " into Elasticsearch");
                    }
                }

                @Override
                public void onFailure(Throwable e) {
                    log.error("The " + type + " of id " + id + " wasn't indexed : " + stringify(source), e);
                }
            });

        } catch (IOException e) {
            log.error("The " + type + " of id " + id + " wasn't indexed", e);
        }
    }

    /**
     * Indexes an collection of objects to elasticsearch.
     * This method is synchronous.
     *
     * @param collection Object to index.
     * @param adapter    Converter to JSON.
     */
    private <T> void indexAll(Collection<T> collection, ElasticsearchMapper<T> adapter) {
        Assert.notNull(collection);
        Assert.notNull(adapter);

        if (collection.isEmpty())
            return;

        String type = adapter.type();
        BulkRequestBuilder request = client().prepareBulk();

        for (T object : collection) {
            String id = adapter.id(object);
            try {
                XContentBuilder source = adapter.toJson(object);
                IndexRequestBuilder indexRequest = client().prepareIndex(indexName, type, id).setSource(source);
                request.add(indexRequest);

            } catch (IOException e) {
                log.error("The " + type + " of id " + id + " wasn't indexed", e);
            }
        }

        if (log.isDebugEnabled())
            log.debug("Ready to index " + collection.size() + " " + type + " into Elasticsearch.");


        BulkResponse response = request.execute().actionGet();
        if (response.hasFailures()) {
            int errorCount = 0;
            for (BulkItemResponse itemResponse : response) {
                if (itemResponse.failed()) {
                    log.error("The " + type + " of id " + itemResponse.getId() + " wasn't indexed in bulk operation: " + itemResponse.getFailureMessage());
                    ++errorCount;
                }
            }
            log.error(errorCount + " " + type + " where not indexed in bulk operation.");

        } else if (log.isDebugEnabled()) {
            log.debug(collection.size() + " " + type + " indexed into Elasticsearch in bulk operation.");
        }
    }

    /**
     * delete a document.
     * This method is asynchronous.
     *
     * @param object Object to index.
     * @param mapper Converter to JSON.
     */
    private <T> void delete(T object, ElasticsearchMapper<T> mapper) {
        Assert.notNull(object);
        Assert.notNull(mapper);

        final String id = mapper.id(object);
        final String type = mapper.type();

        if (log.isDebugEnabled()) {
            log.debug("Ready to delete the " + type + " of id " + id + " from Elasticsearch: ");
        }

        client().prepareDelete(indexName, type, id).execute(new ActionListener<DeleteResponse>() {
            @Override
            public void onResponse(DeleteResponse deleteResponse) {
                if (log.isDebugEnabled()) {
                    if (deleteResponse.notFound())
                        log.debug(type + " of id " + id + " was not found therefore not deleted.");
                    else
                        log.debug(type + " of id " + id + " was deleted from Elasticsearch.");
                }
            }

            @Override
            public void onFailure(Throwable e) {
                log.error("The " + type + " of id " + id + " wasn't deleted from Elasticsearch.", e);
            }
        });
    }

    private Collection<String> searchByPrefix(String domain, String prefix, int size, ElasticsearchMapper<?> mapper) {
        try {

            SearchRequestBuilder searchRequest = client().prepareSearch(indexName)
                    .setTypes(mapper.type())
                    .setQuery(prefixQuery(mapper.prefixSearchField(), prefix))
                    .setFilter(termFilter("domain", domain))
                    .addFields()
                    .setFrom(0)
                    .setSize(size)
                    .addSort(SortBuilders.fieldSort(mapper.prefixSearchField()).order(SortOrder.ASC));

            if (log.isTraceEnabled())
                log.trace("elasticsearch query : " + searchRequest);

            SearchResponse searchResponse = searchRequest
                    .execute()
                    .actionGet();

            SearchHits searchHits = searchResponse.hits();
            if (searchHits.totalHits() == 0)
                return Collections.emptyList();

            SearchHit[] hits = searchHits.hits();
            final List<String> ids = new ArrayList<String>(hits.length);
            for (SearchHit hit : hits) {
                ids.add(hit.getId());
            }

            if (log.isDebugEnabled())
                log.debug("search " + mapper.type() + " by prefix(\"" + domain + "\", \"" + prefix + "\") = result : " + ids);

            return ids;

        } catch (IndexMissingException e) {
            log.warn("The index " + indexName + " was not found in the Elasticsearch cluster.");
            return Collections.emptyList();

        } catch (ElasticSearchException e) {
            log.error("Error while searching user by prefix in index " + indexName, e);
            return Collections.emptyList();
        }

    }

    /**
     * Stringify a document source for logging purpose.
     *
     * @param source Source of the document.
     * @return A string representation of the document only valid for logging purpose.
     */
    private String stringify(XContentBuilder source) {
        try {
            return source.prettyPrint().string();
        } catch (IOException e) {
            return "";
        }
    }

    /**
     * Used to transform an object to it's indexed representation.
     */
    private static interface ElasticsearchMapper<T> {
        /**
         * Provides object id;
         *
         * @param o object.
         * @return object id.
         */
        String id(T o);

        /**
         * Provides index type of this mapping.
         *
         * @return The elasticsearch index type of the object.
         */
        String type();

        /**
         * @return The name of the field to search by prefix.
         */
        String prefixSearchField();

        /**
         * Convert object to it's indexable JSON document representation.
         *
         * @param o object.
         * @return Document
         * @throws IOException If the creation of the JSON document failed.
         */
        XContentBuilder toJson(T o) throws IOException;
    }


}
