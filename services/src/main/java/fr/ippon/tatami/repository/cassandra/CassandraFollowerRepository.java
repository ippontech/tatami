package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.querybuilder.Select;
import com.datastax.driver.core.querybuilder.Select.Where;
import fr.ippon.tatami.repository.FollowerRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.inject.Inject;
import java.util.Collection;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static com.datastax.driver.core.querybuilder.QueryBuilder.gt;
import static com.datastax.driver.core.querybuilder.QueryBuilder.lt;

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

    @Inject
    Session session;

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

        Statement statement = QueryBuilder.select()
                .column("login")
                .from("followers")
                .where(eq("key", login));
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getString("login"))
                .collect(Collectors.toList());
    }

    @Override
    public String getFollowersCF() {
        return ColumnFamilyKeys.FOLLOWERS_CF;
    }
}
