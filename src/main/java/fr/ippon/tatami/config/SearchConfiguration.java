package fr.ippon.tatami.config;

import fr.ippon.tatami.config.elasticsearch.ElasticSearchServerNodeFactory;
import fr.ippon.tatami.config.elasticsearch.ElasticSearchSettings;
import fr.ippon.tatami.service.SearchService;
import fr.ippon.tatami.service.elasticsearch.ElasticsearchSearchService;
import fr.ippon.tatami.service.lucene.LuceneSearchService;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoRequest;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoResponse;
import org.elasticsearch.client.Client;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.env.Environment;

import javax.inject.Inject;

/**
 * Search configuration : uses Elastic Search if it is configured, basic Lucene otherwise.
 */
@Configuration
public class SearchConfiguration {

    private final Log log = LogFactory.getLog(SearchConfiguration.class);

    @Inject
    private Environment env;

    @Bean
    public SearchService searchService() {
        SearchService searchService = null;
        if (elasticsearchActivated()) {
            log.info("Elastic Search is activated.");
            searchService = new ElasticsearchSearchService();
        } else {
            log.info("Lucene is activated.");
            searchService = new LuceneSearchService();
        }
        return searchService;
    }

    @Bean
    public ElasticSearchSettings esSettings() {
        if (elasticsearchActivated()) {
            String configPath = configurationPath();
            ElasticSearchSettings settings = null;
            if (StringUtils.isBlank(configPath)) {
                settings = new ElasticSearchSettings();
            } else {
                settings = new ElasticSearchSettings(configPath);
            }
            return settings;
        } else {
            return null;
        }
    }

    @Bean(name = "nodeFactory")
    public ElasticSearchServerNodeFactory nodeFactory() {
        if (elasticsearchActivated()) {
            final ElasticSearchServerNodeFactory factory = new ElasticSearchServerNodeFactory();
            factory.setEsSettings(esSettings());
            factory.setIndexName(indexName());
            factory.setElasticsearchActivated(elasticsearchActivated());
            return factory;
        } else {
            return null;
        }
    }

    @Bean
    @DependsOn("nodeFactory")
    public Client client() {
        if (elasticsearchActivated()) {
            log.info("Elasticsearch is activated, initializing client connection...");
            final Client client = nodeFactory().getServerNode().client();

            if (log.isDebugEnabled()) {
                final NodesInfoResponse nir =
                        client.admin().cluster().nodesInfo(new NodesInfoRequest()).actionGet();

                log.debug("Client is now connected to the " + nir.nodes().length + " nodes cluster named "
                        + nir.clusterName());
            }
            return client;
        } else {
            log.warn("Elastic Search is NOT activated  : no client instantiated!");
            return null;
        }
    }

    @Bean
    public String indexName() {
        return env.getRequiredProperty("elasticsearch.indexName");
    }

    @Bean
    public String configurationPath() {
        return env.getRequiredProperty("elasticsearch.path.conf");
    }

    @Bean(name = "elasticsearchActivated")
    public boolean elasticsearchActivated() {
        return env.getProperty("elasticsearch.enabled", Boolean.class);
    }
}
