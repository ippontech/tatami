package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.repository.TaglineRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.List;
import java.util.UUID;

import static fr.ippon.tatami.config.ColumnFamilyKeys.TAGLINE_CF;

/**
 * Cassandra implementation of the Tag line repository.
 * <p/>
 * Structure :
 * - Key = tag + domain
 * - Name = statusId
 * - Value = ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraTaglineRepository extends AbstractCassandraLineRepository implements TaglineRepository {

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
    public List<String> getTagline(String domain, String tag, int size, String since_id, String max_id) {
        return getLineFromCF(TAGLINE_CF, getKey(domain, tag), size, since_id, max_id);
    }

    /**
     * Generates the key for this column family.
     */
    private String getKey(String domain, String tag) {
        return tag.toLowerCase() + "-" + domain;
    }
}
