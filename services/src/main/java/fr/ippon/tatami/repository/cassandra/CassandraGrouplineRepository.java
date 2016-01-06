package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.PreparedStatement;
import fr.ippon.tatami.repository.GrouplineRepository;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import static fr.ippon.tatami.config.ColumnFamilyKeys.GROUPLINE;

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

    private PreparedStatement findByLoginStmt;

    private PreparedStatement deleteByIdStmt;


    @PostConstruct
    public void init() {
        findByLoginStmt = session.prepare(
                "SELECT * " +
                        "FROM " + GROUPLINE+
                        " WHERE key = :key");

        deleteByIdStmt = session.prepare("DELETE FROM " + GROUPLINE +
                " WHERE key = :key " +
                "AND status = :statusId");

    }

    @Override
    public void addStatusToGroupline(UUID groupId, String statusId) {
        addStatus(groupId.toString(), ColumnFamilyKeys.GROUPLINE, statusId);
    }

    @Override
    public void removeStatusesFromGroupline(String groupId, Collection<String> statusIdsToDelete) {
        removeStatuses(groupId, ColumnFamilyKeys.GROUPLINE, statusIdsToDelete);
    }

    @Override
    public List<String> getGroupline(String groupId, int size, String start, String finish) {
        return getLineFromTable(ColumnFamilyKeys.GROUPLINE, groupId, size, start, finish);
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
