package fr.ippon.tatami.repository;

import fr.ippon.tatami.config.ColumnFamilyKeys;
import org.springframework.stereotype.Repository;

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
public class UserTagRepository
        extends AbstractFriendRepository {

    public void addTag(String login, String friendTag) {
        super.addFriend(login, friendTag);
    }

    public void removeTag(String login, String friendTag) {
        super.removeFriend(login, friendTag);
    }

    public Collection<String> findTags(String login) {
        return super.findFriends(login);
    }

    @Override
    public String getFriendsTable() {
        return ColumnFamilyKeys.USER_TAGS_CF;
    }
}
