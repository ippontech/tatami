package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * The Friend Repository.
 *
 * @author Julien Dubois
 */
public interface FriendRepository {

    void addFriend(String login, String friendLogin);

    void removeFriend(String login, String friendLogin);

    Collection<String> findFriendsForUser(String login);
}
