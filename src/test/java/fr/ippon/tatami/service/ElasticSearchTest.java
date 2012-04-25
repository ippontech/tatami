/**
 * 
 */
package fr.ippon.tatami.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.elasticsearch.client.Requests.*;

import java.io.IOException;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.ElasticSearchException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.application.ApplicationTestConfiguration;
import fr.ippon.tatami.domain.Tweet;

/**
 * @author dmartinpro
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(
        classes = ApplicationTestConfiguration.class,
        loader = AnnotationConfigContextLoader.class)
public class ElasticSearchTest extends AbstractCassandraTatamiTest {

    private static final Log LOG = LogFactory.getLog(ElasticSearchTest.class);

	@Inject
	private IndexService service;

	@Inject
	private ElasticSearchServerNodeFactory factory;
	
	@Before
	public void flushIndex() {
		factory.getServerNodes().get(0).client().admin().indices().delete(deleteIndexRequest("tatami")).actionGet();
	}
	
	@Test
	public void testSingleMatch() throws ElasticSearchException, IOException {
    	LOG.debug(ElasticSearchTest.class.getSimpleName() + ": testing...");

		final Tweet tweet1 = new Tweet();
		tweet1.setContent("trying out Elastic Search");
		tweet1.setTweetId("3333g-gggg-gggg-gggg");
		tweet1.setLogin("dmartinpro");

		final Tweet tweet2 = new Tweet();
		tweet2.setContent("Recherche dans du texte riche écrit en français avec un #hashtag caché dedans");
		tweet2.setTweetId("1234-4567-8988");
		tweet2.setLogin("dmartinpro");

		final List<String> ids0 = service.search(Tweet.class, null, "trying", 0, 50);
		assertNotNull(ids0);
		assertEquals(0, ids0.size());

		service.addTweet(tweet1);
		service.addTweet(tweet2);
		factory.getServerNodes().get(0).client().admin().indices().refresh(refreshRequest("tatami")).actionGet();

		final List<String> ids1 = service.search(Tweet.class, null, "trying", 0, 50);
		final List<String> ids2 = service.search(Tweet.class, null, "texte riche pouvant être ecrit en francais", 0, 50);

		assertNotNull(ids1); // not null
		assertEquals(1, ids1.size()); // only one match if everything is ok
		assertEquals(tweet1.getTweetId(), ids1.get(0)); // should be the first tweet

		assertNotNull(ids2); // not null
		assertEquals(1, ids2.size()); // only one match if everything is ok
		assertEquals(tweet2.getTweetId(), ids2.get(0)); // should be the second tweet
	}

}
