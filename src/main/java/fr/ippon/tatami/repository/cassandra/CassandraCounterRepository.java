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
    public void incrementFollowersCounter(String login) {
        incrementCounter(FOLLOWERS_COUNTER, login);
    }

    @Override
    public void incrementFriendsCounter(String login) {
        incrementCounter(FRIENDS_COUNTER, login);
    }

    @Override
    public void incrementTweetCounter(String login) {
        incrementCounter(TWEET_COUNTER, login);
    }

    @Override
    public void decrementFollowersCounter(String login) {
        decrementCounter(FOLLOWERS_COUNTER, login);
    }

    @Override
    public void decrementFriendsCounter(String login) {
        decrementCounter(FRIENDS_COUNTER, login);
    }

    @Override
    public void decrementTweetCounter(String login) {
        decrementCounter(TWEET_COUNTER, login);
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
    public long getTweetCounter(String login) {
        return getCounter(TWEET_COUNTER, login);
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
    public void createTweetCounter(String login) {
        createCounter(TWEET_COUNTER, login);
    }

    private void createCounter(String counterName, String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insertCounter(login, COUNTER_CF,
                createCounterColumn(counterName, 0));
    }

    private void incrementCounter(String counterName, String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.incrementCounter(login, COUNTER_CF, counterName, 1);
    }

    private void decrementCounter(String counterName, String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.decrementCounter(login, COUNTER_CF, counterName, 1);
    }

    private long getCounter(String counterName, String login) {
        CounterQuery<String, String> counter =
                new ThriftCounterColumnQuery<String, String>(keyspaceOperator,
                        StringSerializer.get(),
                        StringSerializer.get());

        counter.setColumnFamily(COUNTER_CF).setKey(login).setName(counterName);
        return counter.execute().get().getValue();
    }
}
