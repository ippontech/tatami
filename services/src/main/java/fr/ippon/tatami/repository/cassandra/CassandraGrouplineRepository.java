package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.GrouplineRepository;
import me.prettyprint.hector.api.Keyspace;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.inject.Inject;
import java.util.Collection;
import java.util.List;

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
    public void addStatusToGroupline(String groupId, String statusId) {
        addStatus(groupId, ColumnFamilyKeys.GROUPLINE_CF, statusId);
    }

    @Override
    public void removeStatusesFromGroupline(String groupId, Collection<String> statusIdsToDelete) {
        removeStatuses(groupId, ColumnFamilyKeys.GROUPLINE_CF, statusIdsToDelete);
    }

    @Override
    public List<String> getGroupline(String groupId, int size, String start, String finish) {
        return getLineFromCF(ColumnFamilyKeys.GROUPLINE_CF, groupId, size, start, finish);
    }
}
