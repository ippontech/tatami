package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.TagCounterRepository;
import me.prettyprint.cassandra.model.thrift.ThriftCounterColumnQuery;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.CounterQuery;
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

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public long getTagCounter(String tag) {
        CounterQuery<String, String> counter =
                new ThriftCounterColumnQuery<String, String>(keyspaceOperator,
                        StringSerializer.get(),
                        StringSerializer.get());

        counter.setColumnFamily(TAG_COUNTER_CF).setKey(tag).setName(TAG_COUNTER);
        return counter.execute().get().getValue();
    }

    @Override
    public void incrementTagCounter(String tag) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.incrementCounter(tag, TAG_COUNTER_CF, TAG_COUNTER, 1);
    }

    @Override
    public void decrementTagCounter(String tag) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.decrementCounter(tag, TAG_COUNTER_CF, TAG_COUNTER, 1);
    }

    @Override
    public void deleteTagCounter(String tag) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addCounterDeletion(tag, TAG_COUNTER_CF, TAG_COUNTER, StringSerializer.get());
        mutator.execute();
    }

    /**
     * Generates the key for this column family.
     */
    /*private String getKey(String domain, String tag) {
        return tag.toLowerCase() + "-" + domain;
    }*/
}
