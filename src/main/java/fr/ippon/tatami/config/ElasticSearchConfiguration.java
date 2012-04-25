package fr.ippon.tatami.config;

import static org.elasticsearch.common.settings.ImmutableSettings.settingsBuilder;
import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoRequest;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.node.Node;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.env.Environment;

import fr.ippon.tatami.service.ElasticSearchServerNodeFactory;
import fr.ippon.tatami.service.util.ElasticSearchSettings;

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
    public ElasticSearchSettings esSettings() {
    	final ElasticSearchSettings esSettings = new ElasticSearchSettings();
    	
    	return esSettings;
    }

//    @Bean
//    @DependsOn(value="nodeFactory")
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

    @Bean(name="nodeFactory")
    public ElasticSearchServerNodeFactory nodeFactory() {
    	final ElasticSearchServerNodeFactory factory = new ElasticSearchServerNodeFactory();
    	factory.setEsSettings(esSettings());
    	factory.setIndexName(indexName());
    	return factory;
    }

    @Bean
    @DependsOn(value="nodeFactory")
    public Client client() {
        boolean activated = env.getProperty("elasticsearch.activated", Boolean.class);
        if (activated) {
            log.info("Elastic Search is activated, initializing client connection...");

    		final Settings settings = esSettings().getSettings();
            final Node clientNode = nodeBuilder().settings(settingsBuilder().put(settings).put("name", "client")).client(true).node();

            Client client = clientNode.client();
            if (log.isDebugEnabled()) {
            	NodesInfoResponse nir = client.admin().cluster().nodesInfo(new NodesInfoRequest()).actionGet();
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
