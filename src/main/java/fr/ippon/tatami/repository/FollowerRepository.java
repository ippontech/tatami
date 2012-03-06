package fr.ippon.tatami.repository;

/**
 * The Follower Respository.
 *
 * @author Julien Dubois
 */
public interface FollowerRepository {

    void addFollower(String email, String followerEmail);

    int getFollowersCount(String email);
}
