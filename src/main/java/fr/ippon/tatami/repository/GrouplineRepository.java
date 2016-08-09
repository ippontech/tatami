package fr.ippon.tatami.repository;

import com.datastax.driver.core.PreparedStatement;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.List;
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
public class GrouplineRepository extends AbstractLineRepository {

    private PreparedStatement findByKeyStmt;

    private PreparedStatement deleteByIdStmt;


    @PostConstruct
    public void init() {
        findByKeyStmt = session.prepare(
                "SELECT * " +
                        "FROM " + GROUPLINE_CF +
                        " WHERE key = :key");

        deleteByIdStmt = session.prepare("DELETE FROM " + GROUPLINE_CF +
                " WHERE key = :key " +
                "AND status = :statusId");

    }

    public void addStatusToGroupline(UUID groupId, String statusId) {
        addStatus(groupId.toString(), ColumnFamilyKeys.GROUPLINE_CF, statusId);
    }

    public void removeStatusesFromGroupline(String groupId, Collection<String> statusIdsToDelete) {
        removeStatuses(groupId, ColumnFamilyKeys.GROUPLINE_CF, statusIdsToDelete);
    }

    public List<String> getGroupline(String groupId, int size, String start, String finish) {
        return getLineFromTable(ColumnFamilyKeys.GROUPLINE_CF, groupId, size, start, finish);
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
