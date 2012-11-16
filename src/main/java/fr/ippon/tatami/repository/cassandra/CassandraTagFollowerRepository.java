package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.TagFollowerRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

import static fr.ippon.tatami.config.ColumnFamilyKeys.FOLLOWERS_CF;

/**
 * Cassandra implementation of the Follower repository.
 * <p/>
 * Structure :
 * - Key = tag + domain
 * - Name = follower login
 * - Value = time
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraTagFollowerRepository
        extends AbstractCassandraFollowerRepository
        implements TagFollowerRepository {

    @Override
    public void addFollower(String tag, String login) {
        super.addFollower(tag, login);
    }

    @Override
    public void removeFollower(String tag, String login) {
        super.removeFollower(tag, login);
    }

    @Override
    public Collection<String> findFollowers(String tag) {
        return super.findFollowers(tag);
    }

    @Override
    public String getFollowersCF() {
        return FOLLOWERS_CF;
    }

    /**
     * Generates the key for this column family.
     */
    /*private String getKey(String domain, String tag) {
        return tag.toLowerCase() + "-" + domain;
    }*/
}
