/**
 *
 */
package fr.ippon.tatami.service;

import fr.ippon.tatami.config.elasticsearch.ElasticSearchServerNodeFactory;
import fr.ippon.tatami.config.elasticsearch.ElasticSearchSettings;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;

import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

/**
 * @author dmartin
 */
public class ElasticSearchServerNodeFactoryTest {

    private static final Log LOG = LogFactory.getLog(ElasticSearchServerNodeFactoryTest.class);

    /**
     * Should simply test if the factory is able to locate the settings resource
     * and instantiate two nodes. If not, this test will fail.
     *
     * @throws IOException
     */
    @Test
    public void testFactory() throws IOException {
        LOG.debug(this.getClass().getSimpleName() + ": testing the ES Factory");

        final ElasticSearchServerNodeFactory f = new ElasticSearchServerNodeFactory();
        f.setIndexName("tatami");
        f.setEsSettings(new ElasticSearchSettings());
        f.buildServerNodes();
        assertNotNull(f.getServerNodes());
        assertEquals(ElasticSearchServerNodeFactory.NODES_NUMBER, f.getServerNodes().size());
        f.shutdownNodes();
    }

}
