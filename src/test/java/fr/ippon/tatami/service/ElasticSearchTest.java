package fr.ippon.tatami.service;

import fr.ippon.tatami.config.elasticsearch.ElasticSearchServerNodeFactory;
import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.test.application.ApplicationElasticSearchTestConfiguration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.ElasticSearchException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import javax.inject.Inject;
import java.io.IOException;
import java.util.Calendar;
import java.util.Map;

import static org.elasticsearch.client.Requests.deleteIndexRequest;
import static org.elasticsearch.client.Requests.refreshRequest;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

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
    private SearchService service;

    @Inject
    private ElasticSearchServerNodeFactory factory;

    @Before
    public void initElasticSearch() {
        //        factory = new ElasticSearchServerNodeFactory();
        //        factory.setElasticsearchActivated(true);
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
        status1.setLogin("dmartinpro@ippon.fr");
        status1.setUsername("dmartinpro");
        status1.setDomain("ippon.fr");
        status1.setStatusDate(Calendar.getInstance().getTime());

        final Status status2 = new Status();
        status2.setContent("Recherche dans du texte riche écrit en français avec un #hashtag caché dedans");
        status2.setStatusId("1234-4567-8988");
        status2.setLogin("dmartinpro@ippon.fr");
        status2.setUsername("dmartinpro");
        status2.setDomain("ippon.fr");
        status2.setStatusDate(Calendar.getInstance().getTime());


        final Map<String, SharedStatusInfo> ids0 = this.service.searchStatus("ippon.fr", "trying", 0, 50);
        assertNotNull(ids0);
        assertEquals(0, ids0.size());

        this.service.addStatus(status1);
        this.service.addStatus(status2);
        this.factory.getServerNode().client().admin().indices().refresh(refreshRequest("tatami")).actionGet();

        final Map<String, SharedStatusInfo> ids1 = this.service.searchStatus("ippon.fr", "trying", 0, 50);
        final Map<String, SharedStatusInfo> ids2 = this.service.searchStatus("ippon.fr", "texte riche pouvant être ecrit en francais", 0, 50);

        assertNotNull(ids1); // not null
        assertEquals(1, ids1.size()); // only one match if everything is ok
        assertEquals(status1.getStatusId(), ids1.keySet().iterator().next()); // should be the first status

        assertNotNull(ids2); // not null
        assertEquals(1, ids2.size()); // only one match if everything is ok
        assertEquals(status2.getStatusId(), ids2.keySet().iterator().next()); // should be the second status
    }

}
