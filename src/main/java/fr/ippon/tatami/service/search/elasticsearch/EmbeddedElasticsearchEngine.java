package fr.ippon.tatami.service.search.elasticsearch;

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
import org.elasticsearch.node.NodeBuilder;
import org.springframework.core.env.Environment;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.inject.Inject;

import static org.elasticsearch.common.settings.ImmutableSettings.settingsBuilder;
import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

/**
 * Transport client configuration.
 */
public class EmbeddedElasticsearchEngine implements ElasticsearchEngine {
    private final Log log = LogFactory.getLog(EmbeddedElasticsearchEngine.class);

    @Inject
    private Environment env;
    private Node node;

    @PostConstruct
    private void init() {
        log.info("Initializing Elasticsearch embedded client...");

        node = nodeBuilder()
                .loadConfigSettings(false)
                .settings(settingsBuilder().loadFromClasspath("META-INF/elasticsearch/elasticsearch-embedded.yml"))
                .node();

        // Looking for nodes configuration
        if (log.isDebugEnabled()) {
            final NodesInfoResponse nir =
                    client().admin().cluster().nodesInfo(new NodesInfoRequest()).actionGet();

            log.debug("Elasticsearch client is now connected to the " + nir.nodes().length + " node(s) cluster named \""
                    + nir.clusterName() + "\"");
        }
    }

    @PreDestroy
    private void close() {
        log.info("Closing Elasticsearch embedded client");
        node.close();
    }

    public Client client() {
        return node.client();
    }
}