package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.GroupCounterRepository;
import me.prettyprint.cassandra.model.thrift.ThriftCounterColumnQuery;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.CounterQuery;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

import static fr.ippon.tatami.config.ColumnFamilyKeys.GROUP_COUNTER_CF;

/**
 * Cassandra implementation of the Group Counter repository.
 * <p/>
 * Structure :
 * - Key = domain
 * - Name = groupId
 * - Value = count
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraGroupCounterRepository implements GroupCounterRepository {

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public long getGroupCounter(String domain, String groupId) {
        CounterQuery<String, String> counter =
                new ThriftCounterColumnQuery<String, String>(keyspaceOperator,
                        StringSerializer.get(),
                        StringSerializer.get());

        counter.setColumnFamily(GROUP_COUNTER_CF).setKey(domain).setName(groupId);
        return counter.execute().get().getValue();
    }

    @Override
    public void incrementGroupCounter(String domain, String groupId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.incrementCounter(domain, GROUP_COUNTER_CF, groupId, 1);
    }

    @Override
    public void decrementGroupCounter(String domain, String groupId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.decrementCounter(domain, GROUP_COUNTER_CF, groupId, 1);
    }

    @Override
    public void deleteGroupCounter(String domain, String groupId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addCounterDeletion(domain, GROUP_COUNTER_CF, groupId, StringSerializer.get());
        mutator.execute();
    }
}
