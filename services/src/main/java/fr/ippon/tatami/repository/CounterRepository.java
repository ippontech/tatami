package fr.ippon.tatami.repository;

/**
 * The Counter Repository.
 *
 * @author Julien Dubois
 */
public interface CounterRepository {

    void incrementFollowersCounter(String login);

    void incrementFriendsCounter(String login);

    void incrementStatusCounter(String login);

    void decrementFollowersCounter(String login);

    void decrementFriendsCounter(String login);

    void decrementStatusCounter(String login);

    long getFollowersCounter(String login);

    long getFriendsCounter(String login);

    long getStatusCounter(String login);

    void createFollowersCounter(String login);

    void createFriendsCounter(String login);

    void createStatusCounter(String login);

    void deleteCounters(String login);
}
