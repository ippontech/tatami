package fr.ippon.tatami.service.elasticsearch;

import org.elasticsearch.action.admin.cluster.node.info.NodesInfoRequest;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.inject.Inject;

/**
 * Transport client configuration.
 */
public class RemoteElasticsearchEngine implements ElasticsearchEngine {

    private static final Logger log = LoggerFactory.getLogger(RemoteElasticsearchEngine.class);

    @Inject
    private Environment env;

    private TransportClient client;

    @PostConstruct
    private void init() {
        log.info("Initializing Elasticsearch remote client...");

        Settings settings = ImmutableSettings.settingsBuilder()
                .put("cluster.name", env.getRequiredProperty("elasticsearch.cluster.name"))
                .build();
        client = new TransportClient(settings, false);

        // Looking for nodes configuration
        String nodes = env.getRequiredProperty("elasticsearch.cluster.nodes");
        String[] nodesAddresses = nodes.split(",");
        if (nodesAddresses.length == 0) {
            throw new IllegalStateException("ES client must have at least one node to connect to");
        }

        for (String nodeAddress : nodesAddresses) {
            client.addTransportAddress(parseAddress(nodeAddress));
        }

        if (log.isInfoEnabled()) {
            NodesInfoResponse nir =
                    client.admin().cluster().nodesInfo(new NodesInfoRequest()).actionGet();

            log.info("Elasticsearch client is now connected to the " + nir.nodes().length + " node(s) cluster named \""
                    + nir.clusterName() + "\"");
        }
    }

    @PreDestroy
    private void close() {
        log.info("Closing Elasticsearch remote client");
        client.close();
    }

    public Client client() {
        return client;
    }

    private InetSocketTransportAddress parseAddress(String address) {
        String[] addressItems = address.split(":", 2);
        int port = Integer.parseInt(addressItems.length > 1 ? addressItems[1] : env.getRequiredProperty("elasticsearch.cluster.default.communication.port"));
        return new InetSocketTransportAddress(addressItems[0], port);
    }
}