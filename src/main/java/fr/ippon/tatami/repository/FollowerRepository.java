package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.ColumnFamilyKeys;
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
 * - Key = username
 * - Name = follower username
 * - Value = time
 *
 * @author Julien Dubois
 */
@Repository
public class FollowerRepository extends AbstractFollowerRepository {

    @Inject
    Session session;

    @Override
    @CacheEvict(value = "followers-cache", key = "#email")
    public void addFollower(String email, String followerEmail) {
        super.addFollower(email, followerEmail);
    }

    @Override
    @CacheEvict(value = "followers-cache", key = "#email")
    public void removeFollower(String email, String followerEmail) {
        super.removeFollower(email, followerEmail);
    }

    @Cacheable("followers-cache")
    public Collection<String> findFollowersForUser(String userEmail) {

        Statement statement = QueryBuilder.select()
            .column("email")
            .from(ColumnFamilyKeys.FOLLOWERS_CF)
            .where(eq("key", userEmail));
        ResultSet results = session.execute(statement);
        return results
            .all()
            .stream()
            .map(e -> e.getString("email"))
            .collect(Collectors.toList());
    }

    @Override
    public String getFollowersCF() {
        return ColumnFamilyKeys.FOLLOWERS_CF;
    }
}
