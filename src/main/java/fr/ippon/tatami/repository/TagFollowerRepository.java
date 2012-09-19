package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Specific Follower repository for tags.
 */
public interface TagFollowerRepository {

    void addFollower(String domain, String tag, String login);

    void removeFollower(String domain, String tag, String login);

    Collection<String> findFollowers(String domain, String tag);

}
