package fr.ippon.tatami.config.elasticsearch;

import static org.elasticsearch.common.settings.ImmutableSettings.settingsBuilder;
import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.exists.IndicesExistsResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.Node;

/**
 * Create some Elastic Search nodes.
 *
 * @author dmartin
 */
public class ElasticSearchServerNodeFactory {

    private static final Log log = LogFactory.getLog(ElasticSearchServerNodeFactory.class);

    private Node serverNode = null;

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
    }

    public void setEsSettings(ElasticSearchSettings esSettings) {
        this.esSettings = esSettings;
    }

    public void setIndexName(final String indexName) {
        this.indexName = indexName;
    }

    public Node getServerNode() {
        return this.serverNode;
    }

    public void setIndexActivated(boolean indexActivated) {
        this.indexActivated = indexActivated;
    }

    @PostConstruct
    public void buildServerNode() throws IOException {
        if (this.indexActivated) {
            log.debug("Instantiating Elastic Search cluster...");
            final Settings settings = this.esSettings.getSettings();

            this.serverNode = nodeBuilder().settings(settingsBuilder()
                    .put(settings)
                    ).node();
            log.debug("  -> node \"" + this.serverNode.settings().get("name") + "\" instantiated.");

            // Prepare the index, if not found
            final Client client = this.serverNode.client();
            IndicesExistsResponse indicesExistsResponse = client.admin().indices().prepareExists(this.indexName).execute().actionGet();
            if (indicesExistsResponse.exists()) {
                log.info("The index \"" + this.indexName + "\" already exists.");
            } else {

                CreateIndexRequestBuilder builder = client.admin().indices().prepareCreate(this.indexName);
                // Get tweets mapping :
                final Map<String, String> typesMapping = this.esSettings.getTypesMapping();

                for (Map.Entry<String, String> entry : typesMapping.entrySet()) {
                    builder.addMapping(entry.getKey(), entry.getValue());
                }
                final CreateIndexResponse response = builder.execute().actionGet();

                boolean acknowledged = response.acknowledged();
                if (acknowledged) {
                    log.info("The index \"" + this.indexName + "\" is created.");
                } else {
                    log.warn("The index \"" + this.indexName + "\" *** WAS NOT SUCCESSFULLY created ***");
                }
            }

            log.info("Elastic Search cluster is now ready !");
        }
    }

    @PreDestroy
    public void shutdownNodes() {
        if (this.indexActivated) {
            log.info("Shutting down Elastic Search nodes...");
            if (this.serverNode != null) {
                this.serverNode.stop();
                log.debug("  -> node \"" + this.serverNode.settings().get("name") + "\" stopped.");
            }
        }
    }

    /**
     * Return the content of a resource in the classpath
     * @param resourceName the resource name (and path)
     * @return the resource's content as a string
     */
    public String loadFromClasspath(final String resourceName) {
        final ClassLoader classLoader = ElasticSearchServerNodeFactory.class.getClassLoader();
        final InputStream is = classLoader.getResourceAsStream(resourceName);
        String source = null;
        try {
            source = IOUtils.toString(is);
        } catch (IOException e) {
            log.warn("Unable to load content of the resource: " + resourceName);
        } finally {
            IOUtils.closeQuietly(is);
        }
        return source;
    }

}
