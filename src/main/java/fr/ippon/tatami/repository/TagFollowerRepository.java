package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Specific Follower repository for tags.
 */
public interface TagFollowerRepository {

    void addFollower(String tag, String login);

    void removeFollower(String tag, String login);

    Collection<String> findFollowers(String tag);

}
