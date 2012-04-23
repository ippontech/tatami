package fr.ippon.tatami.config;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.Map;

/**
 * Elastic Search configuration file.
 *
 * @author Julien Dubois
 */
@Configuration
public class ElasticSearchConfiguration {

    private final Log log = LogFactory.getLog(ElasticSearchConfiguration.class);

    @Inject
    Environment env;

    @Bean
    public TransportClient transportClient() {
        boolean activated = env.getProperty("elasticsearch.activated", Boolean.class);
        if (activated) {
            log.info("Elastic Search is activated, initializing client connection...");
            String elasticSearchHost = env.getRequiredProperty("elasticsearch.host");
            int elasticSearchPort = Integer.parseInt(env.getRequiredProperty("elasticsearch.port"));
            Map<String, String> mapsSettings = new HashMap<String, String>();
            mapsSettings.put("cluster.name", "Tatami cluster");
            mapsSettings.put("client.transport.sniff", "true");

            ImmutableSettings.Builder builder = ImmutableSettings.settingsBuilder();
            builder.put(mapsSettings);
            Settings settings = builder.build();
            TransportClient client = new TransportClient(settings);
            client.addTransportAddress(new InetSocketTransportAddress(elasticSearchHost, elasticSearchPort));

            if (client.connectedNodes().size() == 0) {
                log.fatal("Elastic Search client **wasn't** able to connect to any node. Is Elastic Search server started or your configuration Ok ?");
                throw new RuntimeException("Elastic Search is not running, Tatami could not be started.");
            }
            return client;
        } else {
            log.warn("WARNING ! Elastic Search is NOT activated !");
            return new TransportClient();
        }
    }

    @Bean
    public String indexName() {
        return "tatami";
    }

    @Bean
    public boolean indexActivated() {
        return env.getProperty("elasticsearch.activated", Boolean.class);
    }
}
