package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.UserStatusStat;
import fr.ippon.tatami.repository.DaylineRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.CounterSlice;
import me.prettyprint.hector.api.beans.HCounterColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.SliceCounterQuery;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Collection;
import java.util.TreeSet;

import static fr.ippon.tatami.config.ColumnFamilyKeys.DAYLINE_CF;
import static me.prettyprint.hector.api.factory.HFactory.createCounterSliceQuery;

/**
 * Cassandra implementation of the user repository.
 * <p/>
 * Structure :
 * - Key = day + domain
 * - Name = username
 * - Value = count
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraDaylineRepository implements DaylineRepository {

    private final Log log = LogFactory.getLog(CassandraDaylineRepository.class);

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void addStatusToDayline(Status status, String day) {
        String key = getKey(status.getDomain(), day);
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.incrementCounter(key, DAYLINE_CF, status.getUsername(), 1);
    }

    @Override
    @Cacheable("dayline-cache")
    public Collection<UserStatusStat> getDayline(String domain, String day) {
        String key = getKey(domain, day);
        Collection<UserStatusStat> results = new TreeSet<UserStatusStat>();
        SliceCounterQuery<String, String> query = createCounterSliceQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(DAYLINE_CF)
                .setRange(null, null, false, Integer.MAX_VALUE)
                .setKey(key);

        CounterSlice<String> queryResult = query.execute().get();

        for (HCounterColumn<String> column : queryResult.getColumns()) {
            UserStatusStat stat = new UserStatusStat(column.getName().toString(), column.getValue());
            results.add(stat);
        }
        return results;
    }

    /**
     * Generates the key for this column family.
     */
    private String getKey(String domain, String day) {
        return day + "-" + domain;
    }
}
