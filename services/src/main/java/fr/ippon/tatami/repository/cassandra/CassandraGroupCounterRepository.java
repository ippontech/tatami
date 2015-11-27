package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.GroupCounterRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.util.UUID;

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


    @Override
    public long getGroupCounter(String domain, UUID groupId) {
//        CounterQuery<String, String> counter =
//                new ThriftCounterColumnQuery<String, String>(keyspaceOperator,
//                        StringSerializer.get(),
//                        StringSerializer.get());
//
//        counter.setColumnFamily(GROUP_COUNTER_CF).setKey(domain).setName(groupId);
//        return counter.execute().get().getValue();
        return 0;
    }

    protected final Logger log = LoggerFactory.getLogger(this.getClass().getCanonicalName());

    @Override
    public void incrementGroupCounter(String domain, UUID groupId) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.incrementCounter(domain, GROUP_COUNTER_CF, groupId, 1);
    }

    @Override
    public void decrementGroupCounter(String domain, UUID groupId) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.decrementCounter(domain, GROUP_COUNTER_CF, groupId, 1);
    }

    @Override
    public void deleteGroupCounter(String domain, String groupId) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.addCounterDeletion(domain, GROUP_COUNTER_CF, groupId, StringSerializer.get());
//        mutator.execute();
    }
}
