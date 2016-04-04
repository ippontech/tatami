package fr.ippon.tatami.repository;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import java.util.List;

import static fr.ippon.tatami.config.ColumnFamilyKeys.FRIENDS;

/**
 * Cassandra implementation of the Friend repository.
 * <p/>
 * Structure :
 * - Key = username
 * - Name = friend username
 * - Value = time
 *
 * @author Julien Dubois
 */
@Repository
public class FriendRepository extends AbstractFriendRepository {

    @Override
    @CacheEvict(value = "friends-cache", key = "#username")
    public void addFriend(String username, String friendUsername) {
        super.addFriend(username, friendUsername);
    }

    @Override
    @CacheEvict(value = "friends-cache", key = "#username")
    public void removeFriend(String username, String friendUsername) {
        super.removeFriend(username, friendUsername);
    }

    @Cacheable("friends-cache")
    public List<String> findFriendsForUser(String username) {
        return super.findFriends(username);
    }

    @Override
    public String getFriendsTable() {
        return FRIENDS;
    }
}
