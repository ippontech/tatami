package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.repository.GrouplineRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Map;
import java.util.UUID;

import static fr.ippon.tatami.config.ColumnFamilyKeys.GROUPLINE_CF;

/**
 * Cassandra implementation of the Group line repository.
 * <p/>
 * Structure :
 * - Key = groupId
 * - Name = statusId
 * - Value = ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraGrouplineRepository extends AbstractCassandraLineRepository implements GrouplineRepository {

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void addStatusToGroupline(Status status, String groupId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(
                groupId,
                GROUPLINE_CF,
                HFactory.createColumn(
                        UUID.fromString(status.getStatusId()),
                        "",
                        UUIDSerializer.get(),
                        StringSerializer.get()));

    }

    @Override
    public Map<String, SharedStatusInfo> getGroupline(String groupId, int size, String since_id, String max_id) {
        return getLineFromCF(GROUPLINE_CF, groupId, size, since_id, max_id);
    }
}
