package fr.ippon.tatami.config;

import fr.ippon.tatami.service.elasticsearch.ElasticsearchEngine;
import fr.ippon.tatami.service.elasticsearch.EmbeddedElasticsearchEngine;
import fr.ippon.tatami.service.elasticsearch.RemoteElasticsearchEngine;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.inject.Inject;

import static fr.ippon.tatami.config.Constants.EMBEDDED_ENGINE;
import static fr.ippon.tatami.config.Constants.REMOTE_ENGINE;

/**
 * Search configuration, with Elastic Search.
 */
@Configuration
public class SearchConfiguration {

    private final Log log = LogFactory.getLog(SearchConfiguration.class);

    @Inject
    private Environment env;

    @Bean
    public ElasticsearchEngine elasticsearchEngine() {
        log.info("Starting Elasticsearch");
        String mode = env.getRequiredProperty("elasticsearch.engine.mode");
        if (REMOTE_ENGINE.equalsIgnoreCase(mode)) {
            return new RemoteElasticsearchEngine();
        } else if (EMBEDDED_ENGINE.equalsIgnoreCase(mode)) {
            return new EmbeddedElasticsearchEngine();
        } else {
            log.fatal("Elasticsearch engine mode is not defined, please configure the \"elasticsearch.engine.mode\" property");
            throw new IllegalArgumentException("Elasticsearch engine mode " + mode + " not defined");
        }
    }

    @Bean
    public String indexNamePrefix() {
        return env.getProperty("elasticsearch.indexNamePrefix");
    }
}
