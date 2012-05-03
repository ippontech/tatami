package fr.ippon.tatami.service;

import static org.junit.Assert.assertNotNull;

import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;

import fr.ippon.tatami.config.elasticsearch.ElasticSearchServerNodeFactory;
import fr.ippon.tatami.config.elasticsearch.ElasticSearchSettings;

/**
 * @author dmartin
 */
public class ElasticSearchServerNodeFactoryTest {

    private static final Log log = LogFactory.getLog(ElasticSearchServerNodeFactoryTest.class);

    /**
     * Should simply test if the factory is able to locate the settings resource
     * and instantiate some nodes. If not, this test will fail.
     *
     * @throws IOException
     */
    @Test
    public void testFactory() throws IOException {
        log.debug(this.getClass().getSimpleName() + ": testing the ES Factory");

        final ElasticSearchServerNodeFactory f = new ElasticSearchServerNodeFactory();
        f.setIndexActivated(true);
        f.setIndexName("tatami");
        f.setEsSettings(new ElasticSearchSettings());
        f.buildServerNode();
        assertNotNull(f.getServerNode());
        f.shutdownNodes();
    }

}
