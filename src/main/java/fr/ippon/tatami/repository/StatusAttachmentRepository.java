package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.Constants;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Collection;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static fr.ippon.tatami.config.ColumnFamilyKeys.STATUS_ATTACHMENT_CF;

/**
 * Cassandra implementation of the StatusAttachmentRepository repository.
 * <p/>
 * Structure :
 * - Key = statusId
 * - Name = attachmentId
 * - Value = time
 *
 * @author Julien Dubois
 */
@Repository
public class StatusAttachmentRepository {


    @Inject
    private Session session;


    public void addAttachmentId(String statusId, String attachmentId) {
        Statement statement = QueryBuilder.insertInto(STATUS_ATTACHMENT_CF)
                .value("statusId", UUID.fromString(statusId))
                .value("attachmentId",UUID.fromString(attachmentId))
                .value("created",System.currentTimeMillis());
        session.execute(statement);
    }


    public void removeAttachmentId(String statusId, String attachmentId) {
        Statement statement = QueryBuilder.delete().from(STATUS_ATTACHMENT_CF)
                .where(eq("statusId", UUID.fromString(statusId)))
                .and(eq("attachmentId", UUID.fromString(attachmentId)));
        session.execute(statement);
    }


    public Collection<String> findAttachmentIds(String statusId) {
        Statement statement = QueryBuilder.select()
                .column("attachmentId")
                .from(STATUS_ATTACHMENT_CF)
                .where(eq("statusId", UUID.fromString(statusId)))
                .limit(Constants.CASSANDRA_MAX_ROWS);
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getUUID("attachmentId").toString())
                .collect(Collectors.toList());
    }
}
