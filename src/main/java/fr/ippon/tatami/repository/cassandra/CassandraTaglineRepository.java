package fr.ippon.tatami.repository.cassandra;

import static fr.ippon.tatami.config.ColumnFamilyKeys.TAGLINE_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.inject.Inject;

import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.repository.TaglineRepository;
import fr.ippon.tatami.repository.cassandra.util.DomainTagUtil;

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

    private final Log log = LogFactory.getLog(CassandraTaglineRepository.class);

    @Inject
    private Keyspace keyspaceOperator;

    private static final Pattern HASHTAG_PATTERN = Pattern.compile("#(\\w+)");

    @Override
    public void addStatusToTagline(Status status, String domain) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        Matcher m = HASHTAG_PATTERN.matcher(status.getContent());
        while (m.find()) {
            String tag = m.group(1);
            if (tag != null && !tag.isEmpty() && !tag.contains("#")) {
                if (log.isDebugEnabled()) {
                    log.debug("Found tag : " + tag);
                }
                mutator.insert(DomainTagUtil.getColumnFamilyKey(domain, tag), TAGLINE_CF, HFactory.createColumn(UUID.fromString(status.getStatusId()),
                        "", UUIDSerializer.get(), StringSerializer.get()));
            }
        }
    }

    @Override
    public Map<String, String> getTagline(String domain, String tag, int size) {
        ColumnSlice<UUID, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                .setColumnFamily(TAGLINE_CF)
                .setKey(DomainTagUtil.getColumnFamilyKey(domain, tag))
                .setRange(null, null, true, size)
                .execute()
                .get();

        Map<String, String> line = new LinkedHashMap<String, String>();
        for (HColumn<UUID, String> column : result.getColumns()) {
            line.put(column.getName().toString(), null);
        }
        return line;
    }

}
