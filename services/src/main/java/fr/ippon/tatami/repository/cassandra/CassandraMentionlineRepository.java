package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.mapping.MappingManager;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.repository.MentionlineRepository;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.List;

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
public class CassandraMentionlineRepository extends AbstractCassandraLineRepository implements MentionlineRepository {

    private PreparedStatement findByLoginStmt;

    private PreparedStatement deleteByIdStmt;


    @PostConstruct
    public void init() {
        findByLoginStmt = session.prepare(
                "SELECT * " +
                        "FROM mentionline " +
                        "WHERE key = :key");

        deleteByIdStmt = session.prepare("DELETE FROM mentionline " +
                "WHERE key = :key " +
                "AND status = :statusId");

    }


    @Override
    public void addStatusToMentionline(String mentionedLogin, String statusId) {
        addStatus(mentionedLogin, ColumnFamilyKeys.MENTIONLINE, statusId);
    }

    @Override
    public void removeStatusesFromMentionline(String mentionedLogin, Collection<String> statusIdsToDelete) {
        removeStatuses(mentionedLogin, ColumnFamilyKeys.MENTIONLINE, statusIdsToDelete);
    }

    @Override
    public List<String> getMentionline(String login, int size, String start, String finish) {
        return getLineFromTable("mentionLine", login, size, start, finish);
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
