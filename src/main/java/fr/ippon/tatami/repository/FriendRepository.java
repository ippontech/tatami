package fr.ippon.tatami.repository;

import java.util.List;

/**
 * The Friend Repository.
 *
 * @author Julien Dubois
 */
public interface FriendRepository {

    void addFriend(String login, String friendLogin);

    void removeFriend(String login, String friendLogin);

    List<String> findFriendsForUser(String login);
}
