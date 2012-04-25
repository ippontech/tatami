/**
 * 
 */
package fr.ippon.tatami.service;

import static org.elasticsearch.client.Requests.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
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
import org.elasticsearch.indices.IndexMissingException;
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

    private static final Log LOG = LogFactory.getLog(IndexService.class);

    private static final String ALL_FIELDS = "_all";
    
	@Inject
	private Client client;

	@Inject
	private String indexName;

	/**
	 * Add an item to the index
	 * @param clazz the item class
	 * @param uid the item identifier
	 * @param jsonifiedObject the item json representation
	 * @return the response's Id
	 */
	private String addObject(@SuppressWarnings("rawtypes") final Class clazz, String uid, XContentBuilder jsonifiedObject) {

		if (LOG.isDebugEnabled()) {
			String itemAsString = null;
			try {
				itemAsString = jsonifiedObject.prettyPrint().string();
			} catch (IOException e) {
				itemAsString = clazz.getSimpleName() + "-" + uid;
			}
			LOG.debug("Ready to inject this json object into ES: " + itemAsString);
		}

		final String dataType = clazz.getSimpleName().toLowerCase();
		IndexResponse response = client.prepareIndex(indexName, dataType, uid)
	        .setSource(jsonifiedObject)
	        .execute()
	        .actionGet();

		// Should we force the update ? Not sure... due to performance cost
		client.admin().indices().refresh(refreshRequest(indexName)).actionGet();

		return (response == null) ? null : response.getId();
	}

	/**
	 * Delete a object from the index
	 * @param clazz the item class
	 * @param uid : the item identifier
	 * @return the response's Id
	 */
	private String removeObject(@SuppressWarnings("rawtypes") final Class clazz, String uid) {

		final String dataType = clazz.getSimpleName().toLowerCase();
        if (LOG.isDebugEnabled()) {
        	LOG.debug("Removing a " + dataType + " item from the index : #" + uid);
        }
		final DeleteResponse response = client.delete(new DeleteRequest(indexName, dataType, uid)).actionGet();
		return response.getId();
	}

	/**
	 * Add a tweet to the index
	 * @param tweet the tweet to add : can't be null
	 * @return the response's Id
	 */
	public String addTweet(final Tweet tweet) {
		Assert.notNull(tweet, "tweet can't be null");

		XContentBuilder jsonifiedObject = null;
		try {
			jsonifiedObject = XContentFactory.jsonBuilder()
										        .startObject()
										            .field("login", tweet.getLogin())
										            .field("postDate", tweet.getTweetDate())
										            .field("message", StringEscapeUtils.unescapeHtml(tweet.getContent()))
										        .endObject();
		} catch (IOException e) {
			LOG.error("The message wasn't added to the index: "
						+ tweet.getTweetId()
						+ " ["
						+ tweet.toString()
						+ "]", e);
			return null;
		}

		return addObject(tweet.getClass(), tweet.getTweetId(), jsonifiedObject);
	}

	/**
	 * Delete a tweet from the index
	 * @param tweet the tweet to delete
	 * @return the response's Id
	 */
	public String removeTweet(final Tweet tweet) {
		Assert.notNull(tweet, "tweet can't be null");
		return removeObject(tweet.getClass(), tweet.getTweetId());
	}

	/**
	 * Search an item in the index
	 * @param clazz the item type
	 * @param field a particular field to search into
	 * @param query the query
	 * @param page the page to return
	 * @param size the size of a page
	 * @return a list of uid
	 */
	public List<String> search(@SuppressWarnings("rawtypes") final Class clazz, final String field, final String query, int page, int size) {

		final String name = (StringUtils.isBlank(field) ? ALL_FIELDS : field);
		final QueryBuilder qb = QueryBuilders.textQuery(name, query);
		final String dataType = clazz.getSimpleName().toLowerCase();

		SearchResponse searchResponse = null;
		try {
			searchResponse = client.prepareSearch(indexName)
		        .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
		        .setQuery(qb)
		        .setTypes(dataType)
		        .setFrom(page*size).setSize(size).setExplain(false)
		        .execute()
		        .actionGet();
		} catch (IndexMissingException e)  {
			LOG.warn("The index was not found in the cluster.");
			return new ArrayList<String>(0);
		}

		final SearchHits searchHits = searchResponse.getHits();
		final Long hitsNumber = searchHits.getTotalHits();
		if (hitsNumber == 0) {
			return new ArrayList<String>(0);
		}

		final SearchHit[] searchHitsArray = searchHits.getHits();
		final List<String> items = new ArrayList<String>(hitsNumber.intValue());
		for (int i = 0; i < searchHitsArray.length; i++) {
			items.add(searchHitsArray[i].getId());
		}

		return items;
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
			LOG.error("The user wasn't added to the index: "
					+ user.getLogin()
					+ " ["
					+ user.toString()
					+ "]", e);
			return null;
		}

		return addObject(user.getClass(), user.getLogin(), jsonifiedObject);
	}

	/**
	 * Delete a user from the index (based on his login, as it's his primary key)
	 * @param user the user to delete
	 * @return the response's Id
	 */
	public String removeUser(final User user) {
		Assert.notNull(user, "user can't be null");
		return removeObject(user.getClass(), user.getLogin());
	}

   /**
     * Search for who the login starts the semae
     *
     * @param query the query to look for
     * @return a List of users' ids
     */
    public List<String> searchSimilarUsers(final String query) {

        Assert.notNull(query, "query can't be null");

        final QueryBuilder qb = QueryBuilders.prefixQuery("_all", query);

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
