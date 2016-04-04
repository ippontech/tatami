package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.repository.CounterRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

import static com.datastax.driver.core.querybuilder.QueryBuilder.*;


/**
 * Cassandra implementation of the Counter repository.
 * <p/>
 * Structure :
 * - Key = username
 * - Name = counterId
 * - Value = count
 *
 * @author Julien Dubois
 */
@Repository
public class CounterRepository {

    public static final String COUNTER = "counter";
    public static final String USERNAME = "username";
    @Inject
    Session session;

    private static final String STATUS_COUNTER = "STATUS_COUNTER";

    private static final String FOLLOWERS_COUNTER = "FOLLOWERS_COUNTER";

    private static final String FRIENDS_COUNTER = "FRIENDS_COUNTER";



    @CacheEvict(value = "user-cache", key = "#username")
    public void incrementFollowersCounter(String username) {
        incrementCounter(FOLLOWERS_COUNTER, username);
    }


    @CacheEvict(value = {"user-cache", "suggest-users-cache"}, key = "#username")
    public void incrementFriendsCounter(String username) {
        incrementCounter(FRIENDS_COUNTER, username);
    }


    @CacheEvict(value = "user-cache", key = "#username")
    public void incrementStatusCounter(String username) {
        incrementCounter(STATUS_COUNTER, username);
    }


    @CacheEvict(value = "user-cache", key = "#username")
    public void decrementFollowersCounter(String username) {
        decrementCounter(FOLLOWERS_COUNTER, username);
    }


    @CacheEvict(value = "user-cache", key = "#username")
    public void decrementFriendsCounter(String username) {
        decrementCounter(FRIENDS_COUNTER, username);
    }


    @CacheEvict(value = "user-cache", key = "#username")
    public void decrementStatusCounter(String username) {
        decrementCounter(STATUS_COUNTER, username);
    }


    public long getFollowersCounter(String username) {
        return getCounter(FOLLOWERS_COUNTER, username);
    }


    public long getFriendsCounter(String username) {
        return getCounter(FRIENDS_COUNTER, username);
    }


    public long getStatusCounter(String username) {
        return getCounter(STATUS_COUNTER, username);
    }


    public void createFollowersCounter(String username) {
        createCounter(FOLLOWERS_COUNTER, username);
    }


    public void createFriendsCounter(String username) {
        createCounter(FRIENDS_COUNTER, username);
    }


    public void createStatusCounter(String username) {
        createCounter(STATUS_COUNTER, username);
    }


    public void deleteCounters(String username) {
        Statement statement = QueryBuilder.delete().from(COUNTER)
                .where(eq(USERNAME, username));
        session.execute(statement);
    }

    private void createCounter(String counterName, String username) {
        Statement statement = QueryBuilder.update(COUNTER)
                .with(incr(counterName,0))
                .where(eq(USERNAME,username));
        session.execute(statement);
    }

    private void incrementCounter(String counterName, String username) {
        Statement statement = QueryBuilder.update(COUNTER)
                .with(incr(counterName,1))
                .where(eq(USERNAME,username));
        session.execute(statement);
    }

    private void decrementCounter(String counterName, String username) {
        Statement statement = QueryBuilder.update(COUNTER)
                .with(decr(counterName,1))
                .where(eq(USERNAME,username));
        session.execute(statement);
    }

    private long getCounter(String counterName, String username) {
        Statement statement = QueryBuilder.select()
                .column(counterName)
                .from(COUNTER)
                .where(eq(USERNAME, username));
        ResultSet results = session.execute(statement);
        Row row = results.one();
        if (row != null) {
            return row.getLong(counterName);
        } else {
            return 0;
        }
    }
}
