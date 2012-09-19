package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.repository.TaglineRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import static fr.ippon.tatami.config.ColumnFamilyKeys.TAGLINE_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

/**
 * Cassandra implementation of the status repository.
 * <p/>
 * Structure :
 * - Key = tag + domain
 * - Name = statusId
 * - Value = ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraTaglineRepository implements TaglineRepository {

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void addStatusToTagline(Status status, String tag) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(
                getKey(status.getDomain(), tag),
                TAGLINE_CF,
                HFactory.createColumn(
                        UUID.fromString(status.getStatusId()),
                        "",
                        UUIDSerializer.get(),
                        StringSerializer.get()));

    }

    @Override
    public Map<String, SharedStatusInfo> getTagline(String domain, String tag, int size) {
        ColumnSlice<UUID, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                .setColumnFamily(TAGLINE_CF)
                .setKey(getKey(domain, tag))
                .setRange(null, null, true, size)
                .execute()
                .get();

        Map<String, SharedStatusInfo> line = new LinkedHashMap<String, SharedStatusInfo>();
        for (HColumn<UUID, String> column : result.getColumns()) {
            line.put(column.getName().toString(), null);
        }
        return line;
    }

    /**
     * Generates the key for this column family.
     */
    private String getKey(String domain, String tag) {
        return tag.toLowerCase() + "-" + domain;
    }
}
