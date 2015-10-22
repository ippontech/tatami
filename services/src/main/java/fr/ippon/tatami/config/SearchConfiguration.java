package fr.ippon.tatami.config;

import fr.ippon.tatami.service.elasticsearch.ElasticsearchEngine;
import fr.ippon.tatami.service.elasticsearch.EmbeddedElasticsearchEngine;
import fr.ippon.tatami.service.elasticsearch.RemoteElasticsearchEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.inject.Inject;

/**
 * Search configuration, with Elastic Search.
 */
@Configuration
public class SearchConfiguration {

    private final Logger log = LoggerFactory.getLogger(SearchConfiguration.class);

    @Inject
    private Environment env;

    @Bean
    public ElasticsearchEngine elasticsearchEngine() {
        log.info("Starting Elasticsearch");
        String mode = env.getRequiredProperty("elasticsearch.engine.mode");
        if (Constants.REMOTE_ENGINE.equalsIgnoreCase(mode)) {
            return new RemoteElasticsearchEngine();
        } else if (Constants.EMBEDDED_ENGINE.equalsIgnoreCase(mode)) {
            return new EmbeddedElasticsearchEngine();
        } else {
            //Log do not support log.fatal
            log.error("Elasticsearch engine mode is not defined, please configure the \"elasticsearch.engine.mode\" property");
            throw new IllegalArgumentException("Elasticsearch engine mode " + mode + " not defined");
        }
    }

    @Bean
    public String indexNamePrefix() {
        return env.getProperty("elasticsearch.indexNamePrefix");
    }
}
