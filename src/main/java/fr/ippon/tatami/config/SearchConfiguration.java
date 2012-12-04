package fr.ippon.tatami.config;

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
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.env.Environment;

import javax.inject.Inject;
import java.io.File;
import java.io.IOException;

import static fr.ippon.tatami.config.Constants.ELASTICSEARCH_ENGINE;
import static fr.ippon.tatami.config.Constants.LUCENE_ENGINE;

/**
 * Search configuration : uses Elastic Search if it is configured, basic Lucene otherwise.
 */
@Configuration
public class SearchConfiguration {

    private final Log log = LogFactory.getLog(SearchConfiguration.class);

    @Inject
    private Environment env;

    // ElasticSearch or Lucene configuration ? Lucene is the default choice

    @Bean(name = "searchEngine")
    public String searchEngine() {
        String searchEngine = env.getProperty("search.engine");
        if (StringUtils.isBlank(searchEngine)) {
            searchEngine = LUCENE_ENGINE;
        }
        return searchEngine;
    }

    // ElasticSearch configuration
    @Bean
    public Client client() {
        if (ELASTICSEARCH_ENGINE.equalsIgnoreCase(searchEngine())) {
            log.info("Elasticsearch is Tatami's search engine. Initializing a client...");

            final Settings settings = ImmutableSettings.settingsBuilder()
                    .put("cluster.name", env.getRequiredProperty("elasticsearch.cluster.name")).build();
            final TransportClient client = new TransportClient(settings);

            // Looking for nodes configuration
            String nodes = env.getRequiredProperty("elasticsearch.cluster.nodes");
            String[] nodesAddresses = nodes.split(",");
            if (nodesAddresses.length == 0) {
                throw new IllegalStateException("ES client must have at least one node to connect to");
            }

            for (String nodeAddress : nodesAddresses) {
                String[] nodeConf = nodeAddress.split(":");
                Integer nodePort = Integer.valueOf((nodeConf.length > 1) ? nodeConf[1] : env.getRequiredProperty("elasticsearch.cluster.default.communication.port"));
                client.addTransportAddress(new InetSocketTransportAddress(nodeConf[0], nodePort));
            }

            if (log.isDebugEnabled()) {
                final NodesInfoResponse nir =
                        client.admin().cluster().nodesInfo(new NodesInfoRequest()).actionGet();

                log.debug("Elasticsearch client is now connected to the " + nir.nodes().length + " node(s) cluster named \""
                        + nir.clusterName() + "\"");
            }
            return client;
        } else {
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
        if (LUCENE_ENGINE.equalsIgnoreCase(searchEngine())) {
            Analyzer analyzer;
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

    @Bean(name = "statusDirectory")
    public Directory statusDirectory() {
        return internalDirectory("status");
    }

    @Bean(name = "userDirectory")
    public Directory userDirectory() {
        return internalDirectory("user");
    }

    @Bean(name = "groupDirectory")
    public Directory groupDirectory() {
        return internalDirectory("group");
    }

    private Directory internalDirectory(String directoryName) {
        if (LUCENE_ENGINE.equalsIgnoreCase(searchEngine())) {
            log.info("Initializing Lucene " + directoryName + " directory");
            String lucenePath = env.getRequiredProperty("lucene.path");
            try {
                Directory directory = new NIOFSDirectory(
                        new File(lucenePath + System.getProperty("file.separator") + directoryName));

                log.info("Lucene directory " + directoryName + " is initialized");
                return directory;
            } catch (IOException e) {
                log.error("Lucene direcotry could not be started : " + e.getMessage());
                if (log.isWarnEnabled()) {
                    e.printStackTrace();
                }
                return null;
            }
        } else {
            return null;
        }
    }

    @Bean(name = "statusIndexWriter")
    @DependsOn({"statusDirectory"})
    public IndexWriter statusIndexWriter() {
        Directory directory = statusDirectory();
        return internalIndexWriter(directory);
    }

    @Bean
    @DependsOn({"userDirectory"})
    public IndexWriter userIndexWriter() {
        Directory directory = userDirectory();
        return internalIndexWriter(directory);
    }

    @Bean
    @DependsOn({"groupDirectory"})
    public IndexWriter groupIndexWriter() {
        Directory directory = groupDirectory();
        return internalIndexWriter(directory);
    }

    private IndexWriter internalIndexWriter(Directory directory) {
        if (!ELASTICSEARCH_ENGINE.equalsIgnoreCase(searchEngine())) {
            try {
                if (directory != null) {
                    Analyzer analyzer = analyzer();
                    IndexWriterConfig indexWriterConfig =
                            new IndexWriterConfig(Version.LUCENE_36, analyzer);

                    IndexWriter indexWriter = new IndexWriter(directory,
                            indexWriterConfig);

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
    @DependsOn({"statusIndexWriter"})
    public SearcherManager statusSearcherManager() {
        return internalSearcherManager(statusIndexWriter());
    }

    @Bean
    @DependsOn({"userIndexWriter"})
    public SearcherManager userSearcherManager() {
        return internalSearcherManager(userIndexWriter());
    }

    @Bean
    @DependsOn({"groupIndexWriter"})
    public SearcherManager groupSearcherManager() {
        return internalSearcherManager(groupIndexWriter());
    }

    private SearcherManager internalSearcherManager(IndexWriter indexWriter) {
        if (LUCENE_ENGINE.equalsIgnoreCase(searchEngine())) {
            try {
                if (indexWriter != null) {
                    SearcherManager searcherManager = new SearcherManager(indexWriter, true, null);
                    return searcherManager;
                } else {
                    return null;
                }
            } catch (IOException e) {
                log.error("Lucene I/O error while reading : " + e.getMessage());
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
