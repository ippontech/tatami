package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.TagFriendRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

import static fr.ippon.tatami.config.ColumnFamilyKeys.TAG_FRIENDS_CF;

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
public class CassandraTagFriendRepository
        extends AbstractCassandraFriendRepository
        implements TagFriendRepository {

    @Override
    public void addFriend(String domain, String login, String friendTag) {
        super.addFriend(login, getKey(domain, friendTag));
    }

    @Override
    public void removeFriend(String domain, String login, String friendTag) {
        super.removeFriend(login, getKey(domain, friendTag));
    }

    @Override
    public Collection<String> findFriends(String domain, String login) {
        return super.findFriends(getKey(domain, login));
    }

    @Override
    public String getFriendsCF() {
        return TAG_FRIENDS_CF;
    }

    /**
     * Generates the key for this column family.
     */
    private String getKey(String domain, String tag) {
        return tag.toLowerCase() + "-" + domain;
    }
}
