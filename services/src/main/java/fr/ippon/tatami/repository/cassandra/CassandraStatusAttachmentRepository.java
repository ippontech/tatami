package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.repository.StatusAttachmentRepository;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static fr.ippon.tatami.config.ColumnFamilyKeys.SHARES_CF;
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
public class CassandraStatusAttachmentRepository
        implements StatusAttachmentRepository {


    @Inject
    private Session session;

    @Override
    public void addAttachmentId(String statusId, String attachmentId) {
        Statement statement = QueryBuilder.insertInto(STATUS_ATTACHMENT_CF)
                .value("statusId", UUID.fromString(statusId))
                .value("attachmentId",UUID.fromString(attachmentId))
                .value("created",System.currentTimeMillis());
        session.execute(statement);
    }

    @Override
    public void removeAttachmentId(String statusId, String attachmentId) {
        Statement statement = QueryBuilder.delete().from(STATUS_ATTACHMENT_CF)
                .where(eq("statusId", UUID.fromString(statusId)))
                .and(eq("attachmentId", UUID.fromString(attachmentId)));
        session.execute(statement);
    }

    @Override
    public Collection<String> findAttachmentIds(String statusId) {
        Statement statement = QueryBuilder.select()
                .column("attachmentId")
                .from(STATUS_ATTACHMENT_CF)
                .where(eq("statusId", statusId))
                .limit(Constants.CASSANDRA_MAX_ROWS);
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getString("attachmentId"))
                .collect(Collectors.toList());
    }
}
