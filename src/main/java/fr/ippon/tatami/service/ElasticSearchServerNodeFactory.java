/**
 * 
 */
package fr.ippon.tatami.service;

import static org.elasticsearch.client.Requests.createIndexRequest;
import static org.elasticsearch.common.settings.ImmutableSettings.settingsBuilder;
import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.action.admin.indices.exists.IndicesExistsResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.Node;

import fr.ippon.tatami.service.util.ElasticSearchSettings;

/**
 * Create some Elastic Search nodes
 * @author dmartin
 *
 */
public class ElasticSearchServerNodeFactory {

    private static final Log LOG = LogFactory.getLog(ElasticSearchServerNodeFactory.class);

	public static final int NODES_NUMBER = 2;

	private int nodesNumber = NODES_NUMBER;
	private List<Node> serverNodes = null;

	private ElasticSearchSettings esSettings;

	private String indexName;

	/**
	 * Return a default Factory
	 * @return
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

	@PostConstruct
	public void buildServerNodes() throws IOException {
		LOG.debug("Instantiating " + this.nodesNumber + " nodes...");
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
			LOG.debug("  -> node \"" + node.settings().get("name") + "\" instantiated.");
		}

		// Prepare the index, if not found
		final Client client = serverNodes.get(0).client();
		IndicesExistsResponse indicesExistsResponse = client.admin().indices().prepareExists(indexName).execute().actionGet();
		if (indicesExistsResponse.exists()) {
			LOG.info("The index " + indexName + " already exists.");
		} else {
			client.admin().indices().create(createIndexRequest(indexName)).actionGet();
			LOG.info("The index " + indexName + " is created.");
		}

		LOG.debug("ES nodes instantiated !");
	}

	@PreDestroy
	public void shutdownNodes() {
		LOG.debug("Shutting down ES nodes...");
		if (serverNodes != null) {
			for (Node node : serverNodes) {
				node.stop();
				LOG.debug("  -> node \"" + node.settings().get("name") + "\" stopped.");
			}
		}
	}

}
