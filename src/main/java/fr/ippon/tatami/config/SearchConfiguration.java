package fr.ippon.tatami.config;

import fr.ippon.tatami.config.elasticsearch.ElasticSearchServerNodeFactory;
import fr.ippon.tatami.config.elasticsearch.ElasticSearchSettings;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.fr.FrenchAnalyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.search.SearcherManager;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.NIOFSDirectory;
import org.apache.lucene.util.Version;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoRequest;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoResponse;
import org.elasticsearch.client.Client;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.env.Environment;

import javax.inject.Inject;
import java.io.File;
import java.io.IOException;

/**
 * Search configuration : uses Elastic Search if it is configured, basic Lucene otherwise.
 */
@Configuration
public class SearchConfiguration {

    private final Log log = LogFactory.getLog(SearchConfiguration.class);

    @Inject
    private Environment env;

    // ElasticSearch or Lucene configuration ?

    @Bean(name = "elasticsearchActivated")
    public boolean elasticsearchActivated() {
        return env.getProperty("elasticsearch.enabled", Boolean.class);
    }

    // ElasticSearch configuration

    @Bean
    public ElasticSearchSettings esSettings() {
        if (elasticsearchActivated()) {
            String configPath = env.getRequiredProperty("elasticsearch.path.conf");
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

    // Lucene configuration

    @Bean
    public Analyzer analyzer() {
        if (!elasticsearchActivated()) {
            Analyzer analyzer = null;
            String language = env.getRequiredProperty("lucene.language");
            if (language.equals("French")) {
                analyzer = new FrenchAnalyzer(Version.LUCENE_36);
            } else {
                analyzer = new StandardAnalyzer(Version.LUCENE_36);
            }
            return analyzer;
        } else {
            return null;
        }
    }

    @Bean
    @DependsOn({"analyzer"})
    public IndexWriterConfig indexWriterConfig() {
        if (!elasticsearchActivated()) {
            Analyzer analyzer = analyzer();
            IndexWriterConfig indexWriterConfig =
                    new IndexWriterConfig(Version.LUCENE_36, analyzer);

            return indexWriterConfig;
        } else {
            return null;
        }
    }

    @Bean
    public Directory directory() {
        if (!elasticsearchActivated()) {
            log.info("Initializing Lucene search engine...");
            String lucenePath = env.getRequiredProperty("lucene.path");
            try {
                Directory directory = new NIOFSDirectory(new File(lucenePath));
                log.info("Lucene is initialized");
                return directory;
            } catch (IOException e) {
                log.error("Lucene could not be started : " + e.getMessage());
                if (log.isWarnEnabled()) {
                    e.printStackTrace();
                }
                log.error("The search engine will NOT be available in Tatami.");
                return null;
            }
        } else {
            return null;
        }
    }

    @Bean
    @DependsOn({"indexWriterConfig", "directory"})
    public IndexWriter indexWriter() {
        if (!elasticsearchActivated()) {
            try {
                Directory directory = directory();
                if (directory != null) {
                    IndexWriter indexWriter = new IndexWriter(directory(),
                            indexWriterConfig());

                    return indexWriter;
                } else {
                    return null;
                }
            } catch (IOException e) {
                log.error("Lucene I/O error while writing : " + e.getMessage());
                if (log.isInfoEnabled()) {
                    e.printStackTrace();
                }
                return null;
            }
        } else {
            return null;
        }
    }

    @Bean
    @DependsOn({"indexWriter"})
    public SearcherManager searcherManager() {
        if (!elasticsearchActivated()) {
            try {
                IndexWriter indexWriter = indexWriter();
                if (indexWriter != null) {
                    SearcherManager searcherManager = new SearcherManager(indexWriter, true, null);
                    return searcherManager;
                } else {
                    return null;
                }
            } catch (IOException e) {
                log.error("Lucene I/O error wnile reading : " + e.getMessage());
                if (log.isInfoEnabled()) {
                    e.printStackTrace();
                }
                return null;
            }
        } else {
            return null;
        }
    }
}
