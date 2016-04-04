package fr.ippon.tatami.repository;

import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.domain.status.Share;
import fr.ippon.tatami.repository.UserlineRepository;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static fr.ippon.tatami.config.ColumnFamilyKeys.USERLINE_CF;
import static fr.ippon.tatami.config.ColumnFamilyKeys.USERLINE_SHARES_CF;

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
public class UserlineRepository extends AbstractLineRepository {

    @Inject
    Session session;

    private PreparedStatement deleteByIdStmt;


    @PostConstruct
    public void init() {
        deleteByIdStmt = session.prepare("DELETE FROM userline " +
                "WHERE key = :key " +
                "AND status = :statusId");

    }

    public void addStatusToUserline(String username, String statusId) {
        Statement statement = QueryBuilder.insertInto("userline")
                .value("key", username)
                .value("status", UUID.fromString(statusId));
        session.execute(statement);
    }

    public void removeStatusesFromUserline(String username, Collection<String> statusIdsToDelete) {
        removeStatuses(username,"userline",statusIdsToDelete);
    }

    public void shareStatusToUserline(String currentUsername, Share share) {
        shareStatus(currentUsername, share, USERLINE_CF, USERLINE_SHARES_CF);
    }

    public List<String> getUserline(String username, int size, String start, String finish) {
        return getLineFromTable("userline", username, size, start, finish);
    }

    public void deleteUserline(String username) {
        Statement statement = QueryBuilder.delete().from(ColumnFamilyKeys.USERLINE_CF)
                .where(eq("username", username));
        session.execute(statement);
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
