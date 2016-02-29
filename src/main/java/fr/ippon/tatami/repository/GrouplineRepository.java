package fr.ippon.tatami.repository;

import com.datastax.driver.core.PreparedStatement;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.repository.GrouplineRepository;
import org.springframework.stereotype.Repository;

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
public class GrouplineRepository extends AbstractLineRepository {

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

    public void addStatusToGroupline(UUID groupId, String statusId) {
        addStatus(groupId.toString(), ColumnFamilyKeys.GROUPLINE, statusId);
    }

    public void removeStatusesFromGroupline(String groupId, Collection<String> statusIdsToDelete) {
        removeStatuses(groupId, ColumnFamilyKeys.GROUPLINE, statusIdsToDelete);
    }

    public List<String> getGroupline(String groupId, int size, String start, String finish) {
        return getLineFromTable(ColumnFamilyKeys.GROUPLINE, groupId, size, start, finish);
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
