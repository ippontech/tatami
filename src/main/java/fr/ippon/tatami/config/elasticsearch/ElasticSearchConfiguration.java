package fr.ippon.tatami.config.elasticsearch;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoRequest;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoResponse;
import org.elasticsearch.client.Client;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.env.Environment;

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
        return new ElasticSearchSettings(configurationPath());
    }

    @Bean(name = "nodeFactory")
    public ElasticSearchServerNodeFactory nodeFactory() {
        if (indexActivated()) {
            final ElasticSearchServerNodeFactory factory = new ElasticSearchServerNodeFactory();
            factory.setEsSettings(esSettings());
            factory.setIndexName(indexName());
            factory.setIndexActivated(indexActivated());
            return factory;
        } else {
            return null;
        }
    }

    @Bean
    @DependsOn("nodeFactory")
    public Client client() {
        if (indexActivated()) {
            this.log.info("Elastic Search is activated, initializing client connection...");
            final Client client = nodeFactory().getServerNode().client();

            if (this.log.isDebugEnabled()) {
                final NodesInfoResponse nir =
                        client.admin().cluster().nodesInfo(new NodesInfoRequest()).actionGet();

                this.log.debug("Client is now connected to the " + nir.nodes().length + " nodes cluster named "
                        + nir.clusterName());
            }
            return client;
        } else {
            this.log.warn("Elastic Search is NOT activated  : no client instantiated!");
            return null;
        }
    }

    @Bean
    public String indexName() {
        return this.env.getRequiredProperty("elasticsearch.indexName");
    }

    @Bean
    public String configurationPath() {
        return this.env.getRequiredProperty("elasticsearch.path.conf");
    }

    @Bean
    public boolean indexActivated() {
        return this.env.getProperty("elasticsearch.activated", Boolean.class);
    }

}
