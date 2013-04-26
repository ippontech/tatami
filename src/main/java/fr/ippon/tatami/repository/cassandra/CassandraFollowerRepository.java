package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.FollowerRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
    @CacheEvict(value = "followers-cache", key = "#login")
    public void addFollower(String login, String followerLogin) {
        super.addFollower(login, followerLogin);
    }

    @Override
    @CacheEvict(value = "followers-cache", key = "#login")
    public void removeFollower(String login, String followerLogin) {
        super.removeFollower(login, followerLogin);
    }

    @Override
    @Cacheable("followers-cache")
    public Collection<String> findFollowersForUser(String login) {
        return super.findFollowers(login);
    }

    @Override
    public String getFollowersCF() {
        return FOLLOWERS_CF;
    }
}
