package fr.ippon.tatami.repository;

/**
 * The Counter Respository.
 *
 * @author Julien Dubois
 */
public interface CounterRepository {

    void incrementFollowersCounter(String login);

    void incrementFriendsCounter(String login);

    void incrementTweetCounter(String login);

    void decrementFollowersCounter(String login);

    void decrementFriendsCounter(String login);

    void decrementTweetCounter(String login);

    long getFollowersCounter(String login);

    long getFriendsCounter(String login);

    long getTweetCounter(String login);

    void createFollowersCounter(String login);

    void createFriendsCounter(String login);

    void createTweetCounter(String login);
}
