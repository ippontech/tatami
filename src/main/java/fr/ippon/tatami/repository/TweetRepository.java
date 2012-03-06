package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;

/**
 * The User Respository.
 *
 * @author Julien Dubois
 */
public interface TweetRepository {

    Tweet createTweet(String email, String content);

    void addTweetToUserline(Tweet tweet);
}
