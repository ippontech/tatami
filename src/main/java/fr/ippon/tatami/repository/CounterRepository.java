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
 * - Key = email
 * - Name = counterId
 * - Value = count
 *
 * @author Julien Dubois
 */
@Repository
public class CounterRepository {

    public static final String COUNTER = "counter";
    public static final String EMAIL = "email";
    @Inject
    Session session;

    private static final String STATUS_COUNTER = "STATUS_COUNTER";

    private static final String FOLLOWERS_COUNTER = "FOLLOWERS_COUNTER";

    private static final String FRIENDS_COUNTER = "FRIENDS_COUNTER";



    @CacheEvict(value = "user-cache", key = "#email")
    public void incrementFollowersCounter(String email) {
        incrementCounter(FOLLOWERS_COUNTER, email);
    }


    @CacheEvict(value = {"user-cache", "suggest-users-cache"}, key = "#email")
    public void incrementFriendsCounter(String email) {
        incrementCounter(FRIENDS_COUNTER, email);
    }


    @CacheEvict(value = "user-cache", key = "#email")
    public void incrementStatusCounter(String email) {
        incrementCounter(STATUS_COUNTER, email);
    }


    @CacheEvict(value = "user-cache", key = "#email")
    public void decrementFollowersCounter(String email) {
        decrementCounter(FOLLOWERS_COUNTER, email);
    }


    @CacheEvict(value = "user-cache", key = "#email")
    public void decrementFriendsCounter(String email) {
        decrementCounter(FRIENDS_COUNTER, email);
    }


    @CacheEvict(value = "user-cache", key = "#email")
    public void decrementStatusCounter(String email) {
        decrementCounter(STATUS_COUNTER, email);
    }


    public long getFollowersCounter(String email) {
        return getCounter(FOLLOWERS_COUNTER, email);
    }


    public long getFriendsCounter(String email) {
        return getCounter(FRIENDS_COUNTER, email);
    }


    public long getStatusCounter(String email) {
        return getCounter(STATUS_COUNTER, email);
    }


    public void createFollowersCounter(String email) {
        createCounter(FOLLOWERS_COUNTER, email);
    }


    public void createFriendsCounter(String email) {
        createCounter(FRIENDS_COUNTER, email);
    }


    public void createStatusCounter(String email) {
        createCounter(STATUS_COUNTER, email);
    }


    public void deleteCounters(String email) {
        Statement statement = QueryBuilder.delete().from(COUNTER)
                .where(eq(EMAIL, email));
        session.execute(statement);
    }

    private void createCounter(String counterName, String email) {
        Statement statement = QueryBuilder.update(COUNTER)
                .with(incr(counterName,0))
                .where(eq(EMAIL,email));
        session.execute(statement);
    }

    private void incrementCounter(String counterName, String email) {
        Statement statement = QueryBuilder.update(COUNTER)
                .with(incr(counterName,1))
                .where(eq(EMAIL,email));
        session.execute(statement);
    }

    private void decrementCounter(String counterName, String email) {
        Statement statement = QueryBuilder.update(COUNTER)
                .with(decr(counterName,1))
                .where(eq(EMAIL,email));
        session.execute(statement);
    }

    private long getCounter(String counterName, String email) {
        Statement statement = QueryBuilder.select()
                .column(counterName)
                .from(COUNTER)
                .where(eq(EMAIL, email));
        ResultSet results = session.execute(statement);
        Row row = results.one();
        if (row != null) {
            return row.getLong(counterName);
        } else {
            return 0;
        }
    }
}
