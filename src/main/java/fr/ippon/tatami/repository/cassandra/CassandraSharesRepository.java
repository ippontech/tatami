package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.SharesRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Calendar;
import java.util.Collection;
import java.util.LinkedHashSet;

import static fr.ippon.tatami.config.ColumnFamilyKeys.SHARES_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

/**
 * Cassandra implementation of the Shares repository.
 * Lists the shares for a given status.
 * <p/>
 * Structure :
 * - Key = status Id
 * - Name = time
 * - Value = login who shared this status
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraSharesRepository implements SharesRepository {

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    @CacheEvict(value = "status-cache", key = "#statusId")
    public void newShareByLogin(String statusId, String sharedByLogin) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(statusId, SHARES_CF,
                HFactory.createColumn(
                        Calendar.getInstance().getTimeInMillis(),
                        sharedByLogin,
                        LongSerializer.get(),
                        StringSerializer.get()));
    }

    @Override
    public Collection<String> findLoginsWhoSharedAStatus(String statusId) {
        ColumnSlice<Long, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), LongSerializer.get(), StringSerializer.get())
                .setColumnFamily(SHARES_CF)
                .setKey(statusId)
                .setRange(null, null, false, 100) // Limit to 100 logins
                .execute()
                .get();

        Collection<String> sharedByLogins = new LinkedHashSet<String>();
        for (HColumn<Long, String> column : result.getColumns()) {
            sharedByLogins.add(column.getValue());
        }
        return sharedByLogins;
    }

    @Override
    public boolean hasBeenShared(String statusId) {
        int zeroOrOne = HFactory.createCountQuery(keyspaceOperator, StringSerializer.get(), LongSerializer.get())
                .setColumnFamily(SHARES_CF)
                .setKey(statusId)
                .setRange(null, null, 1)
                .execute()
                .get();

        return zeroOrOne > 0;
    }
}
