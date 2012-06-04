package fr.ippon.tatami.service;

import static org.elasticsearch.client.Requests.deleteIndexRequest;
import static org.elasticsearch.client.Requests.refreshRequest;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.util.List;

import javax.inject.Inject;

import fr.ippon.tatami.domain.Status;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.ElasticSearchException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import fr.ippon.tatami.application.ApplicationElasticSearchTestConfiguration;
import fr.ippon.tatami.config.elasticsearch.ElasticSearchServerNodeFactory;

/**
 * @author dmartinpro
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(
        classes = ApplicationElasticSearchTestConfiguration.class,
        loader = AnnotationConfigContextLoader.class)
public class ElasticSearchTest {

    private static final Log log = LogFactory.getLog(ElasticSearchTest.class);

    @Inject
    private IndexService service;

    @Inject
    private ElasticSearchServerNodeFactory factory;

    @Before
    public void initElasticSearch() {
        //        factory = new ElasticSearchServerNodeFactory();
        //        factory.setIndexActivated(true);
        //        factory.setIndexName("tatami");
        //        factory.setEsSettings(new ElasticSearchSettings());
        //        factory.buildServerNodes();
        try {
            this.factory.getServerNode().client().admin().indices().delete(deleteIndexRequest("tatami")).actionGet();
        } catch (ElasticSearchException e) {
            // do nothing
        }
    }

    @Test
    public void testSingleMatch() throws ElasticSearchException, IOException {
        log.debug(ElasticSearchTest.class.getSimpleName() + ": testing...");

        final Status status1 = new Status();
        status1.setContent("trying out Elastic Search");
        status1.setStatusId("3333g-gggg-gggg-gggg");
        status1.setLogin("dmartinpro");

        final Status status2 = new Status();
        status2.setContent("Recherche dans du texte riche écrit en français avec un #hashtag caché dedans");
        status2.setStatusId("1234-4567-8988");
        status2.setLogin("dmartinpro");

        final List<String> ids0 = this.service.search(Status.class, null, "trying", 0, 50, null, null);
        assertNotNull(ids0);
        assertEquals(0, ids0.size());

        this.service.addStatus(status1);
        this.service.addStatus(status2);
        this.factory.getServerNode().client().admin().indices().refresh(refreshRequest("tatami")).actionGet();

        final List<String> ids1 = this.service.search(Status.class, null, "trying", 0, 50, null, null);
        final List<String> ids2 = this.service.search(Status.class, null, "texte riche pouvant être ecrit en francais", 0, 50, null, null);

        assertNotNull(ids1); // not null
        assertEquals(1, ids1.size()); // only one match if everything is ok
        assertEquals(status1.getStatusId(), ids1.get(0)); // should be the first status

        assertNotNull(ids2); // not null
        assertEquals(1, ids2.size()); // only one match if everything is ok
        assertEquals(status2.getStatusId(), ids2.get(0)); // should be the second status
    }

}
