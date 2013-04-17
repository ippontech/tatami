package fr.ippon.tatami.config;

import fr.ippon.tatami.service.search.elasticsearch.ElasticsearchEngine;
import fr.ippon.tatami.service.search.elasticsearch.EmbeddedElasticsearchEngine;
import fr.ippon.tatami.service.search.elasticsearch.RemoteElasticsearchEngine;
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
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.env.Environment;

import javax.inject.Inject;
import java.io.File;
import java.io.IOException;

import static fr.ippon.tatami.config.Constants.ELASTICSEARCH_ENGINE;
import static fr.ippon.tatami.config.Constants.EMBEDDED_ENGINE;
import static fr.ippon.tatami.config.Constants.LUCENE_ENGINE;
import static fr.ippon.tatami.config.Constants.REMOTE_ENGINE;

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
    public ElasticsearchEngine elasticsearchEngine() {
        if (ELASTICSEARCH_ENGINE.equalsIgnoreCase(searchEngine())) {
            log.info("Elasticsearch is Tatami's search engine.");
            String mode = env.getRequiredProperty("elasticsearch.engine.mode");
            if (REMOTE_ENGINE.equalsIgnoreCase(mode))
                return new RemoteElasticsearchEngine();
            else if (EMBEDDED_ENGINE.equalsIgnoreCase(mode))
                return new EmbeddedElasticsearchEngine();
            else
                throw new IllegalArgumentException("Elasticsearch engine mode " + mode + " not defined");
        } else {
            return null;
        }
    }

    @Bean
    public String indexNamePrefix() {
        return env.getProperty("elasticsearch.indexNamePrefix");
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
