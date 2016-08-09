package fr.ippon.tatami.repository;

import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.domain.status.Share;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;

/**
 * Cassandra implementation of the Userline repository.
 * <p/>
 * Structure :
 * - Key : email
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

    public void addStatusToUserline(String email, String statusId) {
        Statement statement = QueryBuilder.insertInto(ColumnFamilyKeys.USERLINE_CF)
            .value("key", email)
            .value("status", UUID.fromString(statusId));
        session.execute(statement);
    }

    public void removeStatusesFromUserline(String email, Collection<String> statusIdsToDelete) {
        removeStatuses(email, ColumnFamilyKeys.USERLINE_CF, statusIdsToDelete);
    }

    public void shareStatusToUserline(String currentEmail, Share share) {
        shareStatus(currentEmail, share, ColumnFamilyKeys.USERLINE_CF, ColumnFamilyKeys.USERLINE_SHARES_CF);
    }

    public List<String> getUserline(String email, int size, String start, String finish) {
        return getLineFromTable(ColumnFamilyKeys.USERLINE_CF, email, size, start, finish);
    }

    public void deleteUserline(String email) {
        Statement statement = QueryBuilder.delete().from(ColumnFamilyKeys.USERLINE_CF)
            .where(eq("email", email));
        session.execute(statement);
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
