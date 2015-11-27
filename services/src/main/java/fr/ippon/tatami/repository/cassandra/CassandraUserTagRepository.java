package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.UserTagRepository;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import java.util.Collection;

/**
 * Cassandra implementation of the TagFriend repository.
 * <p/>
 * Structure :
 * - Key = login
 * - Name = tag + domain
 * - Value = time
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraUserTagRepository
        extends AbstractCassandraFriendRepository
        implements UserTagRepository {

    @Override
    public void addTag(String login, String friendTag) {
        super.addFriend(login, friendTag);
    }

    @Override
    public void removeTag(String login, String friendTag) {
        super.removeFriend(login, friendTag);
    }

    @Override
    public Collection<String> findTags(String login) {
        return super.findFriends(login);
    }

    @Override
    public String getFriendsTable() {
        return ColumnFamilyKeys.USER_TAGS_CF;
    }
}
