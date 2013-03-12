package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.repository.DomainlineRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Map;
import java.util.UUID;

import static fr.ippon.tatami.config.ColumnFamilyKeys.DOMAINLINE_CF;

/**
 * Cassandra implementation of the Domain line repository.
 * <p/>
 * Structure :
 * - Key = domain
 * - Name = statusId
 * - Value = ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraDomainlineRepository extends AbstractCassandraLineRepository implements DomainlineRepository {

    private final static int COLUMN_TTL = 60 * 60 * 24 * 30; // The column is stored for 30 days.

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void addStatusToDomainline(Status status, String domain) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(
                domain,
                DOMAINLINE_CF,
                HFactory.createColumn(
                        UUID.fromString(status.getStatusId()),
                        "",
                        COLUMN_TTL,
                        UUIDSerializer.get(),
                        StringSerializer.get()));
    }

    @Override
    public Map<String, SharedStatusInfo> getDomainline(String domain, int size, String since_id, String max_id) {
        return getLineFromCF(DOMAINLINE_CF, domain, size, since_id, max_id);
    }
}
