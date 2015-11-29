package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.*;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.repository.CounterRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.inject.Inject;

import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.decr;
import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static com.datastax.driver.core.querybuilder.QueryBuilder.incr;


/**
 * Cassandra implementation of the Counter repository.
 * <p/>
 * Structure :
 * - Key = login
 * - Name = counterId
 * - Value = count
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraCounterRepository implements CounterRepository {

    public static final String COUNTER = "counter";
    public static final String LOGIN = "login";
    @Inject
    Session session;

    private static final String STATUS_COUNTER = "STATUS_COUNTER";

    private static final String FOLLOWERS_COUNTER = "FOLLOWERS_COUNTER";

    private static final String FRIENDS_COUNTER = "FRIENDS_COUNTER";


    @Override
    @CacheEvict(value = "user-cache", key = "#login")
    public void incrementFollowersCounter(String login) {
        incrementCounter(FOLLOWERS_COUNTER, login);
    }

    @Override
    @CacheEvict(value = {"user-cache", "suggest-users-cache"}, key = "#login")
    public void incrementFriendsCounter(String login) {
        incrementCounter(FRIENDS_COUNTER, login);
    }

    @Override
    @CacheEvict(value = "user-cache", key = "#login")
    public void incrementStatusCounter(String login) {
        incrementCounter(STATUS_COUNTER, login);
    }

    @Override
    @CacheEvict(value = "user-cache", key = "#login")
    public void decrementFollowersCounter(String login) {
        decrementCounter(FOLLOWERS_COUNTER, login);
    }

    @Override
    @CacheEvict(value = "user-cache", key = "#login")
    public void decrementFriendsCounter(String login) {
        decrementCounter(FRIENDS_COUNTER, login);
    }

    @Override
    @CacheEvict(value = "user-cache", key = "#login")
    public void decrementStatusCounter(String login) {
        decrementCounter(STATUS_COUNTER, login);
    }

    @Override
    public long getFollowersCounter(String login) {
        return getCounter(FOLLOWERS_COUNTER, login);
    }

    @Override
    public long getFriendsCounter(String login) {
        return getCounter(FRIENDS_COUNTER, login);
    }

    @Override
    public long getStatusCounter(String login) {
        return getCounter(STATUS_COUNTER, login);
    }

    @Override
    public void createFollowersCounter(String login) {
        createCounter(FOLLOWERS_COUNTER, login);
    }

    @Override
    public void createFriendsCounter(String login) {
        createCounter(FRIENDS_COUNTER, login);
    }

    @Override
    public void createStatusCounter(String login) {
        createCounter(STATUS_COUNTER, login);
    }

    @Override
    public void deleteCounters(String login) {
        Statement statement = QueryBuilder.delete().from(COUNTER)
                .where(eq(LOGIN, login));
        session.execute(statement);
    }

    private void createCounter(String counterName, String login) {
        Statement statement = QueryBuilder.update(COUNTER)
                .with(incr(counterName,0))
                .where(eq(LOGIN,login));
        session.execute(statement);
    }

    private void incrementCounter(String counterName, String login) {
        Statement statement = QueryBuilder.update(COUNTER)
                .with(incr(counterName,1))
                .where(eq(LOGIN,login));
        session.execute(statement);
    }

    private void decrementCounter(String counterName, String login) {
        Statement statement = QueryBuilder.update(COUNTER)
                .with(decr(counterName,1))
                .where(eq(LOGIN,login));
        session.execute(statement);
    }

    private long getCounter(String counterName, String login) {
        Statement statement = QueryBuilder.select()
                .column(counterName)
                .from(COUNTER)
                .where(eq(LOGIN, login));
        ResultSet results = session.execute(statement);
        Row row = results.one();
        if (row != null) {
            return row.getLong(counterName);
        } else {
            return 0;
        }
    }
}
