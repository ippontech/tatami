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
 * - Key : email
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

    private PreparedStatement findByKeyStmt;

    private PreparedStatement deleteByIdStmt;


    @PostConstruct
    public void init() {
        mapper = new MappingManager(session).mapper(Status.class);
        findByKeyStmt = session.prepare(
                "SELECT * " +
                        "FROM timeline " +
                        "WHERE key = :key");

        deleteByIdStmt = session.prepare("DELETE FROM timeline " +
                "WHERE key = :key " +
                "AND status = :statusId");

    }


    public boolean isStatusInTimeline(String email, String statusId) {
        return findByKeyAndStatusId(TIMELINE_CF,email,UUID.fromString(statusId));
    }

    public void addStatusToTimeline(String email, String statusId) {
        addStatus(email,TIMELINE_CF,statusId);
    }

    public void removeStatusesFromTimeline(String email, Collection<String> statusIdsToDelete) {
        removeStatuses(email,TIMELINE_CF,statusIdsToDelete);
    }

    public void shareStatusToTimeline(String sharedByEmail, String timelineEmail, Share share) {
        shareStatus(timelineEmail, share, TIMELINE_CF, TIMELINE_SHARES_CF);
    }

    public void announceStatusToTimeline(String announcedByUserEmail, List<String> emails, Announcement announcement) {
        PreparedStatement insertAnnouncementPreparedStatement = session.prepare(
                "INSERT INTO timeline (key, status) VALUES (?, ?);");

        BatchStatement batch = new BatchStatement();
        emails.forEach(e -> batch.add(insertAnnouncementPreparedStatement.bind(e, UUIDs.timeBased())));
        session.executeAsync(batch);
    }

    public List<String> getTimeline(String email, int size, String start, String finish) {
        return getLineFromTable(TIMELINE_CF,email,size,start,finish);
    }

    public void deleteTimeline(String email) {
        Statement statement = QueryBuilder.delete()
                .from(TIMELINE_CF)
                .where(eq("key",email));
        session.execute(statement);
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
