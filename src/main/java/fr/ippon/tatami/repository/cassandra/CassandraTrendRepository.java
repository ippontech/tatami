package fr.ippon.tatami.repository.cassandra;

import static fr.ippon.tatami.config.ColumnFamilyKeys.TRENDS_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.inject.Inject;

import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.cassandra.utils.TimeUUIDUtils;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import fr.ippon.tatami.repository.TrendRepository;

/**
 * Cassandra implementation of the Trends repository.
 * <p/>
 * Structure :
 * - Key = domain
 * - Name = date
 * - Value = tag
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraTrendRepository implements TrendRepository {

    private final Log log = LogFactory.getLog(CassandraTrendRepository.class);

    private final static int COLUMN_TTL = 60 * 60 * 24 * 30; // The column is stored for 30 days.

    private final static int TRENDS_NUMBER_OF_TAGS = 100;

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void addTag(String domain, String tag) {
        HColumn<UUID, String> column =
                HFactory.createColumn(
                        TimeUUIDUtils.getUniqueTimeUUIDinMillis(),
                        tag,
                        COLUMN_TTL,
                        UUIDSerializer.get(),
                        StringSerializer.get());

        Mutator<String> mutator =
                HFactory.createMutator(keyspaceOperator, StringSerializer.get());

        mutator.insert(domain, TRENDS_CF, column);
    }

    @Override
    public List<String> getRecentTags(String domain) {
        ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                .setColumnFamily(TRENDS_CF)
                .setKey(domain)
                .setRange(null, null, true, TRENDS_NUMBER_OF_TAGS)
                .execute()
                .get();

        List<String> result = new ArrayList<String>();
        for (HColumn<UUID, String> column : query.getColumns()) {
            String tag = column.getValue();
            result.add(tag);
        }
        return result;
    }
}
