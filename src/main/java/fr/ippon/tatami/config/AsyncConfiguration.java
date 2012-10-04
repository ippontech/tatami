package fr.ippon.tatami.config;

import fr.ippon.tatami.service.SearchService;
import fr.ippon.tatami.service.search.elasticsearch.ElasticsearchSearchService;
import fr.ippon.tatami.service.search.lucene.LuceneIndexReaderReloader;
import fr.ippon.tatami.service.search.lucene.LuceneSearchService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import javax.inject.Inject;
import java.util.concurrent.Executor;

import static fr.ippon.tatami.config.Constants.ELASTICSEARCH_ENGINE;
import static fr.ippon.tatami.config.Constants.LUCENE_ENGINE;


@Configuration
@EnableAsync
@EnableScheduling
public class AsyncConfiguration implements AsyncConfigurer {

    private final Log log = LogFactory.getLog(AsyncConfiguration.class);

    @Inject
    private String searchEngine;

    @Bean
    public SearchService searchService() {
        SearchService searchService;
        if (ELASTICSEARCH_ENGINE.equalsIgnoreCase(searchEngine)) {
            log.info("Elastic Search is activated.");
            searchService = new ElasticsearchSearchService();
        } else {
            log.info("Lucene is activated.");
            searchService = new LuceneSearchService();
        }
        return searchService;
    }

    @Bean
    @DependsOn({"statusSearcherManager", "userSearcherManager"})
    public LuceneIndexReaderReloader luceneIndexReaderReloader() {
        if (LUCENE_ENGINE.equalsIgnoreCase(searchEngine)) {
            LuceneIndexReaderReloader reloader = new LuceneIndexReaderReloader();
            return reloader;
        } else {
            return null;
        }
    }

    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(10000);
        executor.setThreadNamePrefix("TatamiExecutor-");
        executor.initialize();
        return executor;
    }
}
