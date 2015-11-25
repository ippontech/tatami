package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.TagCounterRepository;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

import static fr.ippon.tatami.config.ColumnFamilyKeys.TAG_COUNTER_CF;

/**
 * Cassandra implementation of the Tag Counter repository.
 * <p/>
 * Structure :
 * - Key = tag + domain
 * - Name = TAG_COUNTER
 * - Value = count
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraTagCounterRepository implements TagCounterRepository {

    private static final String TAG_COUNTER = "TAG_COUNTER";

//    @Inject

    @Override
    public long getTagCounter(String domain, String tag) {
//        CounterQuery<String, String> counter =
//                new ThriftCounterColumnQuery<String, String>(keyspaceOperator,
//                        StringSerializer.get(),
//                        StringSerializer.get());
//
//        counter.setColumnFamily(TAG_COUNTER_CF).setKey(getKey(domain, tag)).setName(TAG_COUNTER);
//        return counter.execute().get().getValue();
        return 0;
    }

    @Override
    public void incrementTagCounter(String domain, String tag) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.incrementCounter(getKey(domain, tag), TAG_COUNTER_CF, TAG_COUNTER, 1);
    }

    @Override
    public void decrementTagCounter(String domain, String tag) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.decrementCounter(getKey(domain, tag), TAG_COUNTER_CF, TAG_COUNTER, 1);
    }

    @Override
    public void deleteTagCounter(String domain, String tag) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.addCounterDeletion(getKey(domain, tag), TAG_COUNTER_CF, TAG_COUNTER, StringSerializer.get());
//        mutator.execute();
    }

    /**
     * Generates the key for this column family.
     */
    private String getKey(String domain, String tag) {
        return tag.toLowerCase() + "-" + domain;
    }
}
