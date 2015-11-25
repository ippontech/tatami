package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.CounterRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;



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
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.addCounterDeletion(login, ColumnFamilyKeys.COUNTER_CF, STATUS_COUNTER, StringSerializer.get());
//        mutator.addCounterDeletion(login, ColumnFamilyKeys.COUNTER_CF, FOLLOWERS_COUNTER, StringSerializer.get());
//        mutator.addCounterDeletion(login, ColumnFamilyKeys.COUNTER_CF, FRIENDS_COUNTER, StringSerializer.get());
//        mutator.execute();
    }

    private void createCounter(String counterName, String login) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.insertCounter(login, ColumnFamilyKeys.COUNTER_CF,
//                createCounterColumn(counterName, 0));
    }

    private void incrementCounter(String counterName, String login) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.incrementCounter(login, ColumnFamilyKeys.COUNTER_CF, counterName, 1);
    }

    private void decrementCounter(String counterName, String login) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.decrementCounter(login, ColumnFamilyKeys.COUNTER_CF, counterName, 1);
    }

    private long getCounter(String counterName, String login) {
//        CounterQuery<String, String> counter =
//                new ThriftCounterColumnQuery<String, String>(keyspaceOperator,
//                        StringSerializer.get(),
//                        StringSerializer.get());
//
//        counter.setColumnFamily(ColumnFamilyKeys.COUNTER_CF).setKey(login).setName(counterName);
//        HCounterColumn<String> counterColumn = counter.execute().get();
//        if (counterColumn == null) {
//            return 0;
//        } else {
//            return counterColumn.getValue();
//        }
        return 0;
    }
}
