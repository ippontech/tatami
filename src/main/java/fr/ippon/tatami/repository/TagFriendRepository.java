package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Specific Friend repository for tags.
 */
public interface TagFriendRepository {

    void addFriend(String domain, String login, String tag);

    void removeFriend(String domain, String login, String tag);

    Collection<String> findFriends(String domain, String login);
}
