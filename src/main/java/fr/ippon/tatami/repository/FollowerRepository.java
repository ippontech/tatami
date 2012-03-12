package fr.ippon.tatami.repository;

/**
 * The Follower Respository.
 *
 * @author Julien Dubois
 */
public interface FollowerRepository {

    void addFollower(String login, String followerLogin);
    void removeFollower(String login, String followerLogin);

    int getFollowersCount(String login);
}
