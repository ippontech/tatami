package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.status.Share;
import fr.ippon.tatami.repository.UserlineRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

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
    public void addStatusToUserline(String login, String statusId) {
        addStatus(login,USERLINE_CF, statusId);
    }

    @Override
    public void removeStatusesFromUserline(String login, Collection<String> statusIdsToDelete) {
        removeStatuses(login, USERLINE_CF, statusIdsToDelete);
    }

    @Override
    public void shareStatusToUserline(String currentLogin, Share share) {
        shareStatus(currentLogin, share, USERLINE_CF, USERLINE_SHARES_CF);
    }

    @Override
    public List<String> getUserline(String login, int size, String start, String finish) {
        return getLineFromCF(USERLINE_CF, login, size, start, finish);
    }

    @Override
    public void deleteUserline(String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(login, USERLINE_CF);
        mutator.execute();
    }
}
