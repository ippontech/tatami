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
    @CacheEvict(value = "friends-cache", key = "#email")
    public void addFriend(String email, String friendEmail) {
        super.addFriend(email, friendEmail);
    }

    @Override
    @CacheEvict(value = "friends-cache", key = "#email")
    public void removeFriend(String email, String friendEmail) {
        super.removeFriend(email, friendEmail);
    }

    @Cacheable("friends-cache")
    public List<String> findFriendsForUser(String email) {
        return super.findFriends(email);
    }

    @Override
    public String getFriendsTable() {
        return FRIENDS;
    }
}
