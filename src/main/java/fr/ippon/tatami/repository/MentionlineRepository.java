package fr.ippon.tatami.repository;

import com.datastax.driver.core.PreparedStatement;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.List;

/**
 * Cassandra implementation of the Userline repository.
 * <p/>
 * Structure :
 * - Key : username
 * - Name : status Id
 * - Value : ""
 *
 * @author Julien Dubois
 */
@Repository
public class MentionlineRepository extends AbstractLineRepository {

    private PreparedStatement findByKeyStmt;

    private PreparedStatement deleteByIdStmt;

    @PostConstruct
    public void init() {
        findByKeyStmt = session.prepare(
            "SELECT * " +
                "FROM mentionline " +
                "WHERE key = :key");

        deleteByIdStmt = session.prepare("DELETE FROM mentionline " +
            "WHERE key = :key " +
            "AND status = :statusId");

    }


    public void addStatusToMentionline(String mentionedEmail, String statusId) {
        addStatus(mentionedEmail, ColumnFamilyKeys.MENTIONLINE_CF, statusId);
    }

    public void removeStatusesFromMentionline(String mentionedEmail, Collection<String> statusIdsToDelete) {
        removeStatuses(mentionedEmail, ColumnFamilyKeys.MENTIONLINE_CF, statusIdsToDelete);
    }

    public List<String> getMentionline(String email, int size, String start, String finish) {
        return getLineFromTable(ColumnFamilyKeys.MENTIONLINE_CF, email, size, start, finish);
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
