package fr.ippon.tatami.repository;

import com.datastax.driver.core.BoundStatement;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.mapping.Mapper;
import com.datastax.driver.mapping.MappingManager;
import fr.ippon.tatami.domain.status.Status;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Collection;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Cassandra implementation of the StatusDetails repository.
 * <p/>
 * Structure :
 * - Key = originial status Id
 * - Name = time
 * - Value = reply status Id
 *
 * @author Julien Dubois
 */
@Repository
public class DiscussionRepository {

    @Inject
    Session session;

    private Mapper<Status> mapper;

    private PreparedStatement findStatusIdsInDiscussionStmt;

    private PreparedStatement insertByStatusId;

    @PostConstruct
    public void init() {
        mapper = new MappingManager(session).mapper(Status.class);

        findStatusIdsInDiscussionStmt = session.prepare(
            "SELECT statusId " +
                "FROM discussion " +
                "WHERE discussionId = :originalStatusId " +
                "ORDER BY statusId ASC");

        insertByStatusId = session.prepare(
            "INSERT INTO discussion (statusId, discussionId) " +
                "VALUES (:statusId, :discussionId)");
    }

    public Collection<String> findStatusIdsInDiscussion(String originalStatusId) {
        BoundStatement stmt = findStatusIdsInDiscussionStmt.bind();
        stmt.setString("originalStatusId", originalStatusId);
        ResultSet resultSet = session.execute(stmt);

        return resultSet
            .all()
            .stream()
            .map(e -> e.getUUID("statusId").toString())
            .collect(Collectors.toList());
    }

    @CacheEvict(value = "status-cache", key = "#originalStatusId")
    public void addReplyToDiscussion(String discussionId, String statusId) {
        BoundStatement stmt = insertByStatusId.bind();
        stmt.setUUID("statusId", UUID.fromString(statusId));
        stmt.setString("discussionId", discussionId);
        session.execute(stmt);
    }

}
