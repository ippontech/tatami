package fr.ippon.tatami.config.elasticsearch;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoRequest;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.Node;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.env.Environment;

import javax.inject.Inject;

import static org.elasticsearch.common.settings.ImmutableSettings.settingsBuilder;
import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

/**
 * Elastic Search configuration file.
 *
 * @author Julien Dubois
 */
@Configuration
public class ElasticSearchConfiguration {

    private final Log log = LogFactory.getLog(ElasticSearchConfiguration.class);

    @Inject
    private Environment env;

    @Bean
    public ElasticSearchSettings esSettings() {
        return new ElasticSearchSettings();
    }

    @Bean(name = "nodeFactory")
    public ElasticSearchServerNodeFactory nodeFactory() {
        ElasticSearchServerNodeFactory factory = new ElasticSearchServerNodeFactory();
        factory.setEsSettings(esSettings());
        factory.setIndexName(indexName());
        factory.setIndexActivated(indexActivated());
        return factory;
    }

    @Bean
    public Client client() {
        if (indexActivated()) {
            log.info("Elastic Search is activated, initializing client connection...");

            final Settings settings = esSettings().getSettings();
            final Node clientNode =
                    nodeBuilder()
                            .settings(settingsBuilder()
                            .put(settings).put("name", "client"))
                            .client(true).node();

            Client client = clientNode.client();
            if (log.isDebugEnabled()) {
                NodesInfoResponse nir =
                        client.admin().cluster().nodesInfo(new NodesInfoRequest()).actionGet();

                log.debug("Client is now part of a " + nir.getNodes().length + " nodes cluster");
            }
            return client;
        } else {
            log.warn("WARNING ! Elastic Search is NOT activated !");
            return new TransportClient();
        }
    }

    @Bean
    public String indexName() {
        return env.getRequiredProperty("elasticsearch.indexName");
    }

    @Bean
    public boolean indexActivated() {
        return env.getProperty("elasticsearch.activated", Boolean.class);
    }

}
