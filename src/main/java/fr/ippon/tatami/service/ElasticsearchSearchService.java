package fr.ippon.tatami.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.repository.GroupRepository;
import org.elasticsearch.ElasticsearchException;
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
import org.elasticsearch.client.Client;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.index.query.FilterBuilder;
import org.elasticsearch.index.query.FilterBuilders;
import org.elasticsearch.indices.IndexMissingException;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.IOException;
import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.FilterBuilders.termFilter;
import static org.elasticsearch.index.query.QueryBuilders.matchQuery;

@Service
public class ElasticsearchSearchService implements SearchService {

    private static final Logger log = LoggerFactory.getLogger(ElasticsearchSearchService.class);

    private static final String ALL_FIELD = "_all";

    private static final List<String> TYPES = Collections.unmodifiableList(Arrays.asList("user", "status", "group"));

    @Inject
    private Client client;

    @Inject
    private GroupRepository groupRepository;

    @Override
    public boolean reset() {
        log.info("Reseting ElasticSearch Index");
        if (deleteIndex()) {
            return createIndex();
        } else {
            log.warn("ElasticSearch Index could not be reset!");
            return false;
        }
    }

    /**
     * Delete the tatami index.
     *
     * @return {@code true} if the index is deleted or didn't exist.
     */
    private boolean deleteIndex() {
        for (String type : TYPES) {
            try {
                boolean ack = client.admin().indices().prepareDelete(type).execute().actionGet().isAcknowledged();
                if (!ack) {
                    log.error("Elasticsearch Index wasn't deleted !");
                    return false;
                }
            } catch (IndexMissingException e) {
                // Failling to delete a missing index is supposed to be valid
                log.warn("Elasticsearch Index " + type + " missing, it was not deleted");

            } catch (ElasticsearchException e) {
                log.error("Elasticsearch Index " + type + " was not deleted", e);
                return false;
            }
        }
        log.debug("Elasticsearch Index deleted!");
        return true;
    }

    /**
     * Create the tatami index.
     *
     * @return {@code true} if an error occurs during the creation.
     */
    private boolean createIndex() {
        for (String type : TYPES) {
            try {
                CreateIndexRequestBuilder createIndex = client.admin().indices().prepareCreate(type);
                URL mappingUrl = getClass().getClassLoader().getResource("config/elasticsearch/" + type + "/mappings.json");
                URL settingUrl = getClass().getClassLoader().getResource("config/elasticsearch/" + type + "/settings.json");

                ObjectMapper jsonMapper = new ObjectMapper();
                JsonNode mappings = jsonMapper.readTree(mappingUrl);
                JsonNode indexSettings = jsonMapper.readTree(settingUrl);
                if (indexSettings != null && indexSettings.isObject()) {
                    createIndex.setSettings(jsonMapper.writeValueAsString(indexSettings));
                }

                if (mappings != null && mappings.isObject()) {
                    for (Iterator<Map.Entry<String, JsonNode>> i = mappings.fields(); i.hasNext(); ) {
                        Map.Entry<String, JsonNode> field = i.next();
                        ObjectNode mapping = jsonMapper.createObjectNode();
                        mapping.set(field.getKey(), field.getValue());
                        createIndex.addMapping(field.getKey(), jsonMapper.writeValueAsString(mapping));
                    }
                }

                boolean ack = createIndex.execute().actionGet().isAcknowledged();
                if (!ack) {
                    log.error("Cannot create index " + type);
                    return false;
                }

            } catch (ElasticsearchException e) {
                log.error("Cannot create index " + type, e);
                return false;

            } catch (IOException e) {
                log.error("Cannot create index " + type, e);
                return false;
            }
        }
        return true;
    }

    private final ElasticsearchMapper<Status> statusMapper = new ElasticsearchMapper<Status>() {
        @Override
        public String id(Status status) {
            return status.getStatusId().toString();
        }

        @Override
        public String type() {
            return "status";
        }

        @Override
        public String prefixSearchSortField() {
            return null;
        }

        @Override
        public XContentBuilder toJson(Status status) throws IOException {
            XContentBuilder source = XContentFactory.jsonBuilder()
                .startObject()
                .field("statusId", status.getStatusId())
                .field("domain", status.getDomain())
                .field("username", status.getUsername())
                .field("statusDate", status.getStatusDate())
                .field("content", status.getContent());

            if (status.getGroupId() != null) {
                Group group = groupRepository.getGroupByGroupId(UUID.fromString(status.getGroupId()));
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
    public List<String> searchStatus(final String domain,
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

        try {
            SearchRequestBuilder searchRequest = client.prepareSearch(statusMapper.type())
                .setTypes(statusMapper.type())
                .setQuery(matchQuery(ALL_FIELD, query))
                .setPostFilter(termFilter("domain", domain))
                .addFields()
                .setFrom(page * size)
                .setSize(size)
                .addSort("statusDate", SortOrder.DESC);

            if (log.isTraceEnabled()) {
                log.trace("elasticsearch query : " + searchRequest);
            }
            SearchResponse searchResponse = searchRequest.execute().actionGet();

            SearchHits searchHits = searchResponse.getHits();
            Long hitsNumber = searchHits.totalHits();
            if (hitsNumber == 0) {
                return Collections.emptyList();
            }

            SearchHit[] hits = searchHits.hits();
            List<String> items = new ArrayList<>(hits.length);
            for (SearchHit hit : hits) {
                items.add(hit.getId());
            }

            log.debug("search status with words ({}) = {}", query, items);
            return items;

        } catch (IndexMissingException e) {
            log.warn("The index " + statusMapper.type() + " was not found in the Elasticsearch cluster.");
            return Collections.emptyList();

        } catch (ElasticsearchException e) {
            log.error("Error happened while searching status in index " + statusMapper.type());
            return Collections.emptyList();
        }
    }

    private final ElasticsearchMapper<User> userMapper = new ElasticsearchMapper<User>() {
        @Override
        public String id(User user) {
            return user.getEmail();
        }

        @Override
        public String type() {
            return "user";
        }

        @Override
        public String prefixSearchSortField() {
            return "email";
        }

        @Override
        public XContentBuilder toJson(User user) throws IOException {
            return XContentFactory.jsonBuilder()
                .startObject()
                .field("email", user.getEmail())
                .field("domain", user.getDomain())
                .field("username", user.getUsername())
                .field("firstName", user.getFirstName())
                .field("lastName", user.getLastName())
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
            return group.getGroupId().toString();
        }

        @Override
        public String type() {
            return "group";
        }

        @Override
        public String prefixSearchSortField() {
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
        return ids.stream()
                .map(id -> groupRepository.getGroupByGroupId(UUID.fromString(id)))
                .collect(Collectors.toList());
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

            log.debug("Ready to index the {} id {} into Elasticsearch: {}", type, id, stringify(source));
            client.prepareIndex(type, type, id).setSource(source).execute(new ActionListener<IndexResponse>() {
                @Override
                public void onResponse(IndexResponse response) {
                    log.debug(type + " id " + id + " was " + (response.getVersion() == 1 ? "indexed" : "updated") + " into Elasticsearch");
                }

                @Override
                public void onFailure(Throwable e) {
                    log.error("The " + type + " id " + id + " wasn't indexed : " + stringify(source), e);
                }
            });

        } catch (IOException e) {
            log.error("The " + type + " id " + id + " wasn't indexed", e);
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
        BulkRequestBuilder request = client.prepareBulk();

        for (T object : collection) {
            String id = adapter.id(object);
            try {
                XContentBuilder source = adapter.toJson(object);
                IndexRequestBuilder indexRequest = client.prepareIndex(type, type, id).setSource(source);
                request.add(indexRequest);

            } catch (IOException e) {
                log.error("The " + type + " of id " + id + " wasn't indexed", e);
            }
        }

        log.debug("Ready to index {} {} into Elasticsearch.", collection.size(), type);

        BulkResponse response = request.execute().actionGet();
        if (response.hasFailures()) {
            int errorCount = 0;
            for (BulkItemResponse itemResponse : response) {
                if (itemResponse.isFailed()) {
                    log.error("The " + type + " of id " + itemResponse.getId() + " wasn't indexed in bulk operation: " + itemResponse.getFailureMessage());
                    ++errorCount;
                }
            }
            log.error(errorCount + " " + type + " where not indexed in bulk operation.");

        } else {
            log.debug("{} {} indexed into Elasticsearch in bulk operation.", collection.size(), type);
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

        log.debug("Ready to delete the {} of id {} from Elasticsearch: ", type, id);

        client.prepareDelete(type, type, id).execute(new ActionListener<DeleteResponse>() {
            @Override
            public void onResponse(DeleteResponse deleteResponse) {
                if (log.isDebugEnabled()) {
                    if (!deleteResponse.isFound()) {
                        log.debug("{} of id {} was not found therefore not deleted.", type, id);
                    } else {
                        log.debug("{} of id {} was deleted from Elasticsearch.", type, id);
                    }
                }
            }

            @Override
            public void onFailure(Throwable e) {
                log.error("The " + type + " of id " + id + " wasn't deleted from Elasticsearch.", e);
            }
        });
    }

    private Collection<String>  searchByPrefix(String domain, String prefix, int size, ElasticsearchMapper<?> mapper) {
        try {

            SearchRequestBuilder searchRequest = client.prepareSearch(mapper.type())
                .setTypes(mapper.type())
                .setQuery(matchQuery("prefix", prefix))
                .setPostFilter(termFilter("domain", domain))
                .addFields()
                .setFrom(0)
                .setSize(size)
                .addSort(SortBuilders.fieldSort(mapper.prefixSearchSortField()).order(SortOrder.ASC));

            if (log.isTraceEnabled()) {
                log.trace("elasticsearch query : " + searchRequest);
            }
            SearchResponse searchResponse = searchRequest
                .execute()
                .actionGet();

            SearchHits searchHits = searchResponse.getHits();
            if (searchHits.totalHits() == 0)
                return Collections.emptyList();

            SearchHit[] hits = searchHits.hits();
            final List<String> ids = new ArrayList<>(hits.length);
            for (SearchHit hit : hits) {
                ids.add(hit.getId());
            }

            log.debug("search " + mapper.type() + " by prefix(\"" + domain + "\", \"" + prefix + "\") = result : " + ids);
            return ids;

        } catch (IndexMissingException e) {
            log.warn("The index " + mapper.type() + " was not found in the Elasticsearch cluster.");
            return Collections.emptyList();

        } catch (ElasticsearchException e) {
            log.error("Error while searching user by prefix in index " + mapper.type(), e);
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
         * @return The name of the field to sort by in search by prefix.
         */
        String prefixSearchSortField();

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
