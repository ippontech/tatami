/**
 * 
 */
package fr.ippon.tatami.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;

/**
 * @author dmartinpro
 *
 */
@Service
public class IndexService {

    private final Log log = LogFactory.getLog(IndexService.class);

	@Inject
	private Client client;

	@Inject
	private String indexName;

	/**
	 * Add a tweet to the index
	 * @param tweet the tweet to add : can't be null
	 * @return the response's Id
	 */
	public String addTweet(final Tweet tweet) {
		Assert.notNull(tweet, "tweet can't be null");

		XContentBuilder jsonifiedObject;
		try {
			jsonifiedObject = XContentFactory.jsonBuilder()
										        .startObject()
										            .field("login", tweet.getLogin())
										            .field("postDate", tweet.getTweetDate())
										            .field("message", tweet.getContent())
										        .endObject();
		} catch (IOException e) {
			throw new RuntimeException(e); // Not the best way, but the shortest for this version. TODO improve exception handling
		}

		if (log.isDebugEnabled()) {
			log.debug("Ready to inject this json object into ES: " + jsonifiedObject.prettyPrint());
		}
		
		final String dataType = Tweet.class.getSimpleName().toLowerCase();
		final IndexResponse response = client.prepareIndex(indexName, dataType, tweet.getTweetId())
		        .setSource(jsonifiedObject)
		        .execute()
		        .actionGet();

		return response.getId();
	}

	/**
	 * Delete a tweet from the index
	 * @param tweet the tweet to delete
	 * @return the response's Id
	 */
	public String removeTweet(final Tweet tweet) {
		Assert.notNull(tweet, "tweet can't be null");

        if (log.isDebugEnabled()) {
            log.debug("Removing a tweet from the index : #" + tweet.getTweetId());
        }
		final String dataType = Tweet.class.getSimpleName().toLowerCase();
		final DeleteResponse response = client.delete(new DeleteRequest(indexName, dataType, tweet.getTweetId())).actionGet();
		return response.getId();
	}

	/**
	 * Search for a tweet, the naive version (no paging...)
	 * @param query the query to look for
	 * @return a List of tweets' ids
	 */
	public List<String> searchTweets(final String query) {
		final QueryBuilder qb = QueryBuilders.textQuery("_all", query);
		final SearchResponse searchResponse = client.prepareSearch("tatami")
		        .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
		        .setQuery(qb)
		        .setFrom(0).setSize(60).setExplain(true)
		        .execute()
		        .actionGet();

		final SearchHits searchHits = searchResponse.getHits();
		final Long hitsNumber = searchResponse.getHits().getTotalHits();
		if (hitsNumber == 0) {
			return new ArrayList<String>(0);
		}

		final SearchHit[] searchHitsArray = searchHits.getHits();
		final List<String> tweets = new ArrayList<String>(hitsNumber.intValue());
		for (int i = 0; i < searchHitsArray.length; i++) {
			tweets.add(searchHitsArray[i].getId());
		}

		return tweets;
	}

	/**
	 * Add a user to the index
	 * @param user the user to add : can't be null
	 * @return the response's Id
	 */
	public String addUser(final User user) {
		Assert.notNull(user, "user can't be null");

		XContentBuilder jsonifiedObject;
		try {
			jsonifiedObject = XContentFactory.jsonBuilder()
										        .startObject()
										            .field("login", user.getLogin())
										            .field("email", user.getEmail())
										            .field("firstName", user.getFirstName())
										            .field("lastName", user.getLastName())
										        .endObject();
		} catch (IOException e) {
			throw new RuntimeException(e); // Not the best way, but the shortest for this version. TODO improve exception handling
		}

		if (log.isDebugEnabled()) {
			log.debug("Ready to inject this json object into ES: " + jsonifiedObject.prettyPrint());
		}
		
		final String dataType = User.class.getSimpleName().toLowerCase();
		final IndexResponse response = client.prepareIndex(indexName, dataType, user.getLogin())
		        .setSource(jsonifiedObject)
		        .execute()
		        .actionGet();

		return response.getId();
	}

	/**
	 * Delete a user from the index (based on his login, as it's his primary key)
	 * @param user the user to delete
	 * @return the response's Id
	 */
	public String removeUser(final User user) {
		Assert.notNull(user, "user can't be null");

        if (log.isDebugEnabled()) {
            log.debug("Removing a user from the index. login: " + user.getLogin());
        }
		final String dataType = User.class.getSimpleName().toLowerCase();
		final DeleteResponse response = client.delete(new DeleteRequest(indexName, dataType, user.getLogin())).actionGet();
		return response.getId();
	}

	/**
	 * Search for a user (or more), the naive version (no paging...)
	 * @param query the query to look for
	 * @return a List of users' ids
	 */
	public List<String> searchUsers(final String query) {
		Assert.notNull(query, "query can't be null");

		final QueryBuilder qb = QueryBuilders.textQuery("_all", query);
		final SearchResponse searchResponse = client.prepareSearch("tatami")
		        .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
		        .setQuery(qb)
		        .setFrom(0).setSize(60).setExplain(true)
		        .execute()
		        .actionGet();

		final SearchHits searchHits = searchResponse.getHits();
		final Long hitsNumber = searchResponse.getHits().getTotalHits();
		if (hitsNumber == 0) {
			return new ArrayList<String>(0);
		}

		final SearchHit[] searchHitsArray = searchHits.getHits();
		final List<String> users = new ArrayList<String>(hitsNumber.intValue());
		for (int i = 0; i < searchHitsArray.length; i++) {
			users.add(searchHitsArray[i].getId());
		}

		return users;
	}

}
