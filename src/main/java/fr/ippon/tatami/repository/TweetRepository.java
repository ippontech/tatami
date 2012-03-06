package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Tweet;

import java.util.Collection;

/**
 * The User Respository.
 *
 * @author Julien Dubois
 */
public interface TweetRepository {

    Tweet createTweet(String email, String content);

    void addTweetToUserline(Tweet tweet);

    void addTweetToTimeline(String email, Tweet tweet);

    Collection<String> getTimeline(String email);

    Tweet findTweetById(String tweetId);
}
