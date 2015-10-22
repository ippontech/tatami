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
import java.util.Collection;
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
    public void addStatusToTagline(String tag, Status status) {
        addStatus(getKey(status.getDomain(), tag), TAGLINE_CF, status.getStatusId());
    }

    @Override
    public void removeStatusesFromTagline(String tag, String domain, Collection<String> statusIdsToDelete) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        for (String statusId : statusIdsToDelete) {
            mutator.addDeletion(
                    getKey(domain, tag),
                    TAGLINE_CF,
                    UUID.fromString(statusId),
                    UUIDSerializer.get());

        }
        mutator.execute();

    }

    @Override
    public List<String> getTagline(String domain, String tag, int size, String start, String finish) {
        return getLineFromCF(TAGLINE_CF, getKey(domain, tag), size, start, finish);
    }

    /**
     * Generates the key for this column family.
     */
    private String getKey(String domain, String tag) {
        return tag.toLowerCase() + "-" + domain;
    }
}
