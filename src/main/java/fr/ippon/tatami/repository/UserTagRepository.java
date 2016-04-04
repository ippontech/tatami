package fr.ippon.tatami.repository;

import fr.ippon.tatami.config.ColumnFamilyKeys;
import org.springframework.stereotype.Repository;

import java.util.Collection;

/**
 * Cassandra implementation of the TagFriend repository.
 * <p/>
 * Structure :
 * - Key = username
 * - Name = tag + domain
 * - Value = time
 *
 * @author Julien Dubois
 */
@Repository
public class UserTagRepository
        extends AbstractFriendRepository {

    public void addTag(String username, String friendTag) {
        super.addFriend(username, friendTag);
    }

    public void removeTag(String username, String friendTag) {
        super.removeFriend(username, friendTag);
    }

    public Collection<String> findTags(String username) {
        return super.findFriends(username);
    }

    @Override
    public String getFriendsTable() {
        return ColumnFamilyKeys.USER_TAGS_CF;
    }
}
