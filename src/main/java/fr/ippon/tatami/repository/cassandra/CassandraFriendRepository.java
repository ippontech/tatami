package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.FriendRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import static fr.ippon.tatami.config.ColumnFamilyKeys.FRIENDS_CF;

/**
 * Cassandra implementation of the Friend repository.
 * <p/>
 * Structure :
 * - Key = login
 * - Name = friend login
 * - Value = time
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraFriendRepository extends AbstractCassandraFriendRepository implements FriendRepository {

    @Override
    public void addFriend(String login, String friendLogin) {
        super.addFriend(login, friendLogin);
    }

    @Override
    public void removeFriend(String login, String friendLogin) {
        super.removeFriend(login, friendLogin);
    }

    @Override
    public List<String> findFriendsForUser(String login) {
        return super.findFriends(login);
    }

    @Override
    public String getFriendsCF() {
        return FRIENDS_CF;
    }
}
