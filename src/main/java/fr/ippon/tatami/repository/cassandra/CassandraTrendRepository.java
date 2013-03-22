package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.TrendRepository;
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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import javax.inject.Inject;
import java.util.*;

import static fr.ippon.tatami.config.ColumnFamilyKeys.TRENDS_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

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
    @CacheEvict(value = "domain-tags-cache", key = "#domain")
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
        return getRecentTags(domain, TRENDS_NUMBER_OF_TAGS);
    }

    @Override
    public List<String> getRecentTags(String domain, int maxNumber) {
        ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                .setColumnFamily(TRENDS_CF)
                .setKey(domain)
                .setRange(null, null, true, maxNumber)
                .execute()
                .get();

        List<String> result = new ArrayList<String>();
        String tag = null;
        for (HColumn<UUID, String> column : query.getColumns()) {
            tag = column.getValue();
            result.add(tag);
        }
        return result;
    }

    @Cacheable(value = "domain-tags-cache", key = "#domain")
    public Collection<String> getDomainTags(String domain) {
        Assert.hasLength(domain);

        final ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                .setColumnFamily(TRENDS_CF)
                .setKey(domain)
                .setRange(null, null, true, TRENDS_NUMBER_OF_TAGS)
                .execute()
                .get();

        final Map<String, String> result = new HashMap<String, String>();
        String tag = null;
        for (HColumn<UUID, String> column : query.getColumns()) {
            tag = column.getValue();
            result.put(tag.toLowerCase(), tag);
        }
        return result.values();
    }

}
