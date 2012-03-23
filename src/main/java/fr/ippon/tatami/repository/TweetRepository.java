package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Tweet;

import java.util.Collection;

/**
 * The User Respository.
 *
 * @author Julien Dubois
 */
public interface TweetRepository {

    Tweet createTweet(String login, String content);

    void removeTweet(Tweet tweet);

    /**
     * Retrieve a persisted tweet's informations
     * @param tweetId
     * @return null if tweet was removed
     */
    Tweet findTweetById(String tweetId);


    void addTweetToDayline(Tweet tweet, String key);

    void addTweetToFavoritesline(Tweet tweet, String login);

    void addTweetToUserline(Tweet tweet);

    void addTweetToTimeline(String login, Tweet tweet);

    void addTweetToTagline(Tweet tweet);

    /** a day's tweets */
    Collection<String> getDayline(String date);

    /** a user's and his followed users tweets */
    Collection<String> getTimeline(String login, int size);

    /** a user's own tweets */
    Collection<String> getUserline(String login, int size);

    /** a tag's tweets */
    Collection<String> getTagline(String tag, int size);

    /** a user's favorite tweets */
    Collection<String> getFavoritesline(String login);
}
