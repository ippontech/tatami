package fr.ippon.tatami.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.util.List;

import javax.inject.Inject;

import org.elasticsearch.ElasticSearchException;
import org.junit.Test;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.service.IndexService;

/**
 * .
 * @author dmartinpro, fdescamps
 */
public class ElasticSearchTest extends AbstractCassandraTatamiTest {

	@Inject
	private IndexService idxservice;

	@Test
	public void testSingleMatch() throws ElasticSearchException, IOException {

		final Tweet tweet1 = new Tweet();
		tweet1.setContent("trying out Elastic Search");
		tweet1.setTweetId("3333g-gggg-gggg-gggg");
		tweet1.setLogin("dmartinpro");

		final Tweet tweet2 = new Tweet();
		tweet2.setContent("Recherche dans du texte riche écrit en français avec un #hashtag caché dedans");
		tweet2.setTweetId("1234-4567-8988");
		tweet2.setLogin("dmartinpro");

		idxservice.addTweet(tweet1);
		idxservice.addTweet(tweet2);

		final List<String> ids = idxservice.searchTweets("texte riche pouvant être ecrit en francais");

		assertNotNull(ids); // not null
		assertEquals(1, ids.size()); // only one match if everything is ok
		assertEquals("1234-4567-8988", ids.get(0)); // should be the second tweet
	}

}