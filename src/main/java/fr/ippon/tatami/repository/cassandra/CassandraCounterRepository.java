package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.CounterRepository;
import me.prettyprint.cassandra.model.thrift.ThriftCounterColumnQuery;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.CounterQuery;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

import static fr.ippon.tatami.application.ColumnFamilyKeys.COUNTER_CF;
import static me.prettyprint.hector.api.factory.HFactory.createCounterColumn;

/**
 * Cassandra implementation of the Follower repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraCounterRepository implements CounterRepository {

    private static final String TWEET_COUNTER = "TWEET_COUNTER";

    private static final String FOLLOWERS_COUNTER = "FOLLOWERS_COUNTER";

    private static final String FRIENDS_COUNTER = "FRIENDS_COUNTER";

    private final Log log = LogFactory.getLog(CassandraCounterRepository.class);

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void incrementFollowersCounter(String email) {
        incrementCounter(FOLLOWERS_COUNTER, email);
    }

    @Override
    public void incrementFriendsCounter(String email) {
        incrementCounter(FRIENDS_COUNTER, email);
    }

    @Override
    public void incrementTweetCounter(String email) {
        incrementCounter(TWEET_COUNTER, email);
    }

    @Override
    public void decrementFollowersCounter(String email) {
        decrementCounter(FOLLOWERS_COUNTER, email);
    }

    @Override
    public void decrementFriendsCounter(String email) {
        decrementCounter(FRIENDS_COUNTER, email);
    }

    @Override
    public void decrementTweetCounter(String email) {
        decrementCounter(TWEET_COUNTER, email);
    }

    @Override
    public long getFollowersCounter(String email) {
        return getCounter(FOLLOWERS_COUNTER, email);
    }

    @Override
    public long getFriendsCounter(String email) {
        return getCounter(FRIENDS_COUNTER, email);
    }

    @Override
    public long getTweetCounter(String email) {
        return getCounter(TWEET_COUNTER, email);
    }

    @Override
    public void createFollowersCounter(String email) {
        createCounter(FOLLOWERS_COUNTER, email);
    }

    @Override
    public void createFriendsCounter(String email) {
        createCounter(FRIENDS_COUNTER, email);
    }

    @Override
    public void createTweetCounter(String email) {
        createCounter(TWEET_COUNTER, email);
    }

    private void createCounter(String counterName, String email) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insertCounter(email, COUNTER_CF,
                createCounterColumn(counterName, 0));
    }

    private void incrementCounter(String counterName, String email) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.incrementCounter(email, COUNTER_CF, counterName, 1);
    }

    private void decrementCounter(String counterName, String email) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.decrementCounter(email, COUNTER_CF, counterName, 1);
    }

    private long getCounter(String counterName, String email) {
        CounterQuery<String, String> counter =
                new ThriftCounterColumnQuery<String, String>(keyspaceOperator,
                        StringSerializer.get(),
                        StringSerializer.get());

        counter.setColumnFamily(COUNTER_CF).setKey(email).setName(counterName);
        return counter.execute().get().getValue();
    }
}
