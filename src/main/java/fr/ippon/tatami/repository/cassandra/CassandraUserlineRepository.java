package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.repository.UserlineRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.UUID;

import static fr.ippon.tatami.config.ColumnFamilyKeys.USERLINE_CF;
import static fr.ippon.tatami.config.ColumnFamilyKeys.USERLINE_SHARES_CF;

/**
 * Cassandra implementation of the Userline repository.
 * <p/>
 * Structure :
 * - Key : login
 * - Name : status Id
 * - Value : ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraUserlineRepository extends AbstractCassandraLineRepository implements UserlineRepository {

    @Override
    public void addStatusToUserline(Status status) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(status.getLogin(), USERLINE_CF, HFactory.createColumn(UUID.fromString(status.getStatusId()),
                "", UUIDSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void shareStatusToUserline(String currentLogin, Status status) {
        shareStatus(currentLogin, status, currentLogin, USERLINE_CF, USERLINE_SHARES_CF);
    }

    @Override
    public Map<String, SharedStatusInfo> getUserline(String login, int size, String since_id, String max_id) {
        return getLineFromCF(USERLINE_CF, login, size, since_id, max_id);
    }

    @Override
    public void deleteUserline(String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(login, USERLINE_CF);
        mutator.execute();
    }
}
