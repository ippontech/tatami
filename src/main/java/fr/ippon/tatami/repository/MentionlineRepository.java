package fr.ippon.tatami.repository;

import com.datastax.driver.core.PreparedStatement;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.repository.MentionlineRepository;
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

    private PreparedStatement findByUsernameStmt;

    private PreparedStatement deleteByIdStmt;


    @PostConstruct
    public void init() {
        findByUsernameStmt = session.prepare(
                "SELECT * " +
                        "FROM mentionline " +
                        "WHERE key = :key");

        deleteByIdStmt = session.prepare("DELETE FROM mentionline " +
                "WHERE key = :key " +
                "AND status = :statusId");

    }


    public void addStatusToMentionline(String mentionedEmail, String statusId) {
        addStatus(mentionedEmail, ColumnFamilyKeys.MENTIONLINE, statusId);
    }

    public void removeStatusesFromMentionline(String mentionedUsername, Collection<String> statusIdsToDelete) {
        removeStatuses(mentionedUsername, ColumnFamilyKeys.MENTIONLINE, statusIdsToDelete);
    }

    public List<String> getMentionline(String username, int size, String start, String finish) {
        return getLineFromTable("mentionLine", username, size, start, finish);
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
