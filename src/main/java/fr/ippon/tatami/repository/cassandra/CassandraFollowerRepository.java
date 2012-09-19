package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.FollowerRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

import static fr.ippon.tatami.config.ColumnFamilyKeys.FOLLOWERS_CF;

/**
 * Cassandra implementation of the Follower repository.
 * <p/>
 * Structure :
 * - Key = login
 * - Name = follower login
 * - Value = time
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraFollowerRepository extends AbstractCassandraFollowerRepository implements FollowerRepository {

    @Override
    public void addFollower(String login, String followerLogin) {
        super.addFollower(login, followerLogin);
    }

    @Override
    public void removeFollower(String login, String followerLogin) {
        super.removeFollower(login, followerLogin);
    }

    @Override
    public Collection<String> findFollowersForUser(String login) {
        return super.findFollowers(login);
    }

    @Override
    public String getFollowersCF() {
        return FOLLOWERS_CF;
    }
}
