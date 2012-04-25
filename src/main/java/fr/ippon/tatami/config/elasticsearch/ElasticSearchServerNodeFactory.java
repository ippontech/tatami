package fr.ippon.tatami.config.elasticsearch;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.action.admin.indices.exists.IndicesExistsResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.Node;
import org.springframework.core.env.Environment;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.inject.Inject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.elasticsearch.client.Requests.createIndexRequest;
import static org.elasticsearch.common.settings.ImmutableSettings.settingsBuilder;
import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

/**
 * Create some Elastic Search nodes.
 *
 * @author dmartin
 */
public class ElasticSearchServerNodeFactory {

    private static final Log log = LogFactory.getLog(ElasticSearchServerNodeFactory.class);

    public static final int NODES_NUMBER = 2;

    private int nodesNumber = NODES_NUMBER;

    private List<Node> serverNodes = null;

    private ElasticSearchSettings esSettings;

    private String indexName;

    private boolean indexActivated;

    /**
     * Return a default Factory.
     */
    public static final ElasticSearchServerNodeFactory getInstance() {
        return new ElasticSearchServerNodeFactory();
    }

    public ElasticSearchServerNodeFactory() {
        this(ElasticSearchServerNodeFactory.NODES_NUMBER);
    }

    public ElasticSearchServerNodeFactory(int nodesNumber) {
        this.nodesNumber = nodesNumber;
    }

    public void setEsSettings(ElasticSearchSettings esSettings) {
        this.esSettings = esSettings;
    }

    public void setIndexName(final String indexName) {
        this.indexName = indexName;
    }

    public List<Node> getServerNodes() {
        return serverNodes;
    }

    public void setIndexActivated(boolean indexActivated) {
        this.indexActivated = indexActivated;
    }

    @PostConstruct
    public void buildServerNodes() throws IOException {
        if (indexActivated) {
            log.debug("Instantiating " + this.nodesNumber + " nodes...");
            final Settings settings = esSettings.getSettings();

            serverNodes = new ArrayList<Node>(this.nodesNumber);
            Node node = null;
            for (int i = 1; i <= this.nodesNumber; i++) {
                node = nodeBuilder()
                        .settings(settingsBuilder()
                                .put(settings)
                                .put("name", "node" + i)
                        ).node();
                serverNodes.add(node);
                log.debug("  -> node \"" + node.settings().get("name") + "\" instantiated.");
            }

            // Prepare the index, if not found
            final Client client = serverNodes.get(0).client();
            IndicesExistsResponse indicesExistsResponse = client.admin().indices().prepareExists(indexName).execute().actionGet();
            if (indicesExistsResponse.exists()) {
                log.info("The index \"" + indexName + "\" already exists.");
            } else {
                client.admin().indices().create(createIndexRequest(indexName)).actionGet();
                log.info("The index \"" + indexName + "\" is created.");
            }

            log.info("Elastic Search nodes instantiated !");
        }
    }

    @PreDestroy
    public void shutdownNodes() {
        if (indexActivated) {
            log.info("Shutting down Elastic Search nodes...");
            if (serverNodes != null) {
                for (Node node : serverNodes) {
                    node.stop();
                    log.debug("  -> node \"" + node.settings().get("name") + "\" stopped.");
                }
            }
        }
    }

}
