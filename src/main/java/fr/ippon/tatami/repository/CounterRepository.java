package fr.ippon.tatami.repository;

/**
 * The Counter Respository.
 *
 * @author Julien Dubois
 */
public interface CounterRepository {

    void incrementFollowersCounter(String email);

    void incrementFriendsCounter(String email);

    void incrementTweetCounter(String email);

    void decrementFollowersCounter(String email);

    void decrementFriendsCounter(String email);

    void decrementTweetCounter(String email);

    long getFollowersCounter(String email);

    long getFriendsCounter(String email);

    long getTweetCounter(String email);

    void createFollowersCounter(String email);

    void createFriendsCounter(String email);

    void createTweetCounter(String email);
}
