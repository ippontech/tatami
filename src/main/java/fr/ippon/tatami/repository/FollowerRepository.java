package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * The Follower Repository.
 *
 * @author Julien Dubois
 */
public interface FollowerRepository {

    void addFollower(String login, String followerLogin);

    void removeFollower(String login, String followerLogin);

    Collection<String> findFollowersForUser(String login);

}
