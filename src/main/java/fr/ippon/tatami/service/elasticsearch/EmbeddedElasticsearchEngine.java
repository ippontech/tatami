package fr.ippon.tatami.service.elasticsearch;

import org.elasticsearch.action.admin.cluster.node.info.NodesInfoResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.node.Node;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import static org.elasticsearch.common.settings.ImmutableSettings.settingsBuilder;
import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

/**
 * Transport client configuration.
 */
public class EmbeddedElasticsearchEngine implements ElasticsearchEngine {

    private final Logger log = LoggerFactory.getLogger(EmbeddedElasticsearchEngine.class);

    private Node node;

    @PostConstruct
    private void init() {
        log.info("Initializing Elasticsearch embedded cluster...");

        node = nodeBuilder()
                .loadConfigSettings(false)
                .settings(settingsBuilder().loadFromClasspath("META-INF/elasticsearch/elasticsearch-embedded.yml"))
                .node();

        // Looking for nodes configuration
        if (log.isInfoEnabled()) {
            final NodesInfoResponse nir =
                    client().admin().cluster().prepareNodesInfo().execute().actionGet();

            log.info("Elasticsearch client is now connected to the " + nir.nodes().length + " node(s) cluster named \""
                    + nir.clusterName() + "\"");
        }
    }

    @PreDestroy
    private void close() {
        log.info("Closing Elasticsearch embedded cluster");
        node.close();
    }

    public Client client() {
        return node.client();
    }
}