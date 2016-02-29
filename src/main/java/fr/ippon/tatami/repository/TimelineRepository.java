package fr.ippon.tatami.repository;

import com.datastax.driver.core.BatchStatement;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.utils.UUIDs;
import com.datastax.driver.mapping.Mapper;
import com.datastax.driver.mapping.MappingManager;
import fr.ippon.tatami.domain.status.Announcement;
import fr.ippon.tatami.domain.status.Share;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.repository.TimelineRepository;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static fr.ippon.tatami.config.ColumnFamilyKeys.TIMELINE_CF;
import static fr.ippon.tatami.config.ColumnFamilyKeys.TIMELINE_SHARES_CF;

/**
 * Cassandra implementation of the Timeline repository.
 * <p/>
 * Structure :
 * - Key : login
 * - Name : status Id
 * - Value : ""
 *
 * @author Julien Dubois
 */
@Repository
public class TimelineRepository extends AbstractLineRepository {

    @Inject
    Session session;

    private Mapper<Status> mapper;

    private PreparedStatement findByLoginStmt;

    private PreparedStatement deleteByIdStmt;


    @PostConstruct
    public void init() {
        mapper = new MappingManager(session).mapper(Status.class);
        findByLoginStmt = session.prepare(
                "SELECT * " +
                        "FROM timeline " +
                        "WHERE key = :key");

        deleteByIdStmt = session.prepare("DELETE FROM timeline " +
                "WHERE key = :key " +
                "AND status = :statusId");

    }


    public boolean isStatusInTimeline(String login, String statusId) {
        return findByLoginAndStatusId(TIMELINE_CF,login,UUID.fromString(statusId));
    }

    public void addStatusToTimeline(String login, String statusId) {
        addStatus(login,TIMELINE_CF,statusId);
    }

    public void removeStatusesFromTimeline(String login, Collection<String> statusIdsToDelete) {
        removeStatuses(login,TIMELINE_CF,statusIdsToDelete);
    }

    public void shareStatusToTimeline(String sharedByLogin, String timelineLogin, Share share) {
        shareStatus(timelineLogin, share, TIMELINE_CF, TIMELINE_SHARES_CF);
    }

    public void announceStatusToTimeline(String announcedByLogin, List<String> logins, Announcement announcement) {
        PreparedStatement insertAnnouncementPreparedStatement = session.prepare(
                "INSERT INTO timeline (key, status) VALUES (?, ?);");

        BatchStatement batch = new BatchStatement();
        logins.forEach(e -> batch.add(insertAnnouncementPreparedStatement.bind(e, UUIDs.timeBased())));
        session.executeAsync(batch);
    }

    public List<String> getTimeline(String login, int size, String start, String finish) {
        return getLineFromTable(TIMELINE_CF,login,size,start,finish);
    }

    public void deleteTimeline(String login) {
        Statement statement = QueryBuilder.delete()
                .from(TIMELINE_CF)
                .where(eq("key",login));
        session.execute(statement);
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
