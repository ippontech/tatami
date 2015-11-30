package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.*;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.querybuilder.Select;
import com.datastax.driver.mapping.MappingManager;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.domain.status.Share;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.repository.UserlineRepository;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.*;
import static fr.ippon.tatami.config.ColumnFamilyKeys.TAGLINE;
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

    @Inject
    Session session;

    private PreparedStatement deleteByIdStmt;


    @PostConstruct
    public void init() {
        deleteByIdStmt = session.prepare("DELETE FROM userline " +
                "WHERE key = :key " +
                "AND status = :statusId");

    }

    @Override
    public void addStatusToUserline(String login, String statusId) {
        Statement statement = QueryBuilder.insertInto("userline")
                .value("key", login)
                .value("status", UUID.fromString(statusId));
        session.execute(statement);
    }

    @Override
    public void removeStatusesFromUserline(String login, Collection<String> statusIdsToDelete) {
        removeStatuses(login,"userline",statusIdsToDelete);
    }

    @Override
    public void shareStatusToUserline(String currentLogin, Share share) {
        shareStatus(currentLogin, share, USERLINE_CF, USERLINE_SHARES_CF);
    }

    @Override
    public List<String> getUserline(String login, int size, String start, String finish) {
        return getLineFromTable("userline", login, size, start, finish);
    }

    @Override
    public void deleteUserline(String login) {
        Statement statement = QueryBuilder.delete().from(ColumnFamilyKeys.USERLINE_CF)
                .where(eq("login", login));
        session.execute(statement);
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
