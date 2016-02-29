package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.repository.FollowerRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Collection;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;

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
public class FollowerRepository extends AbstractFollowerRepository {

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
