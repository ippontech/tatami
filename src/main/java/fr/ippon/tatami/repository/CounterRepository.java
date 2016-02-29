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
 * - Key = login
 * - Name = counterId
 * - Value = count
 *
 * @author Julien Dubois
 */
@Repository
public class CounterRepository {

    public static final String COUNTER = "counter";
    public static final String LOGIN = "login";
    @Inject
    Session session;

    private static final String STATUS_COUNTER = "STATUS_COUNTER";

    private static final String FOLLOWERS_COUNTER = "FOLLOWERS_COUNTER";

    private static final String FRIENDS_COUNTER = "FRIENDS_COUNTER";



    @CacheEvict(value = "user-cache", key = "#login")
    public void incrementFollowersCounter(String login) {
        incrementCounter(FOLLOWERS_COUNTER, login);
    }


    @CacheEvict(value = {"user-cache", "suggest-users-cache"}, key = "#login")
    public void incrementFriendsCounter(String login) {
        incrementCounter(FRIENDS_COUNTER, login);
    }


    @CacheEvict(value = "user-cache", key = "#login")
    public void incrementStatusCounter(String login) {
        incrementCounter(STATUS_COUNTER, login);
    }


    @CacheEvict(value = "user-cache", key = "#login")
    public void decrementFollowersCounter(String login) {
        decrementCounter(FOLLOWERS_COUNTER, login);
    }


    @CacheEvict(value = "user-cache", key = "#login")
    public void decrementFriendsCounter(String login) {
        decrementCounter(FRIENDS_COUNTER, login);
    }


    @CacheEvict(value = "user-cache", key = "#login")
    public void decrementStatusCounter(String login) {
        decrementCounter(STATUS_COUNTER, login);
    }


    public long getFollowersCounter(String login) {
        return getCounter(FOLLOWERS_COUNTER, login);
    }


    public long getFriendsCounter(String login) {
        return getCounter(FRIENDS_COUNTER, login);
    }


    public long getStatusCounter(String login) {
        return getCounter(STATUS_COUNTER, login);
    }


    public void createFollowersCounter(String login) {
        createCounter(FOLLOWERS_COUNTER, login);
    }


    public void createFriendsCounter(String login) {
        createCounter(FRIENDS_COUNTER, login);
    }


    public void createStatusCounter(String login) {
        createCounter(STATUS_COUNTER, login);
    }


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
