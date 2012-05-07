package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Tweet;

import javax.validation.ConstraintViolationException;
import java.util.Collection;

/**
 * The User Respository.
 *
 * @author Julien Dubois
 */
public interface TweetRepository {

    Tweet createTweet(String login, String content) throws ConstraintViolationException;

    void removeTweet(Tweet tweet);

    /**
     * Retrieve a persisted tweet's informations
     *
     * @param tweetId
     * @return null if tweet was removed
     */
    Tweet findTweetById(String tweetId);

    void addTweetToDayline(Tweet tweet, String key);

    void addTweetToFavoritesline(Tweet tweet, String login);
    
    void removeTweetFromFavoritesline(Tweet tweet, String login);

    void addTweetToUserline(Tweet tweet);

    void addTweetToTimeline(String login, Tweet tweet);

    /**
     * analyze a message in order to extract and reference eventual hashtags
     *
     * @param tweet
     */
    void addTweetToTagline(Tweet tweet);

    /**
     * a day's tweets
     */
    Collection<String> getDayline(String date);

    /**
     * a user's and his followed users tweets
     */
    Collection<String> getTimeline(String login, int size, String since_id, String max_id);

    /**
     * a user's own tweets
     */
    Collection<String> getUserline(String login, int size, String since_id, String max_id);

    /**
     * a tag's tweets
     *
     * @param tag cannot be null, empty, nor contain a sharp character (#)
     */
    Collection<String> getTagline(String tag, int size);

    /**
     * a user's favorite tweets
     */
    Collection<String> getFavoritesline(String login);
}
