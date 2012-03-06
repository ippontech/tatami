package fr.ippon.tatami.repository;

/**
 * The Follower Respository.
 *
 * @author Julien Dubois
 */
public interface FriendRepository {

    void addFriend(String email, String friendEmail);
}
