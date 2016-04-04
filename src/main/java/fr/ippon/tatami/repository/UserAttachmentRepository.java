package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.querybuilder.Select;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.config.Constants;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Collection;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.*;


/**
 * Cassandra implementation of the UserAttachment repository.
 * <p/>
 * Structure :
 * - Key = username
 * - Name = attachmentId
 * - Value = time
 *
 * @author Julien Dubois
 */
@Repository
public class UserAttachmentRepository {

    @Inject
    private Session session;

    public void addAttachmentId(String username, String attachmentId) {
        Statement statement = QueryBuilder.insertInto(ColumnFamilyKeys.USER_ATTACHMENT_CF)
                .value("username", username)
                .value("attachmentId", UUID.fromString(attachmentId));
        session.execute(statement);
    }

    public void removeAttachmentId(String username, String attachmentId) {
        Statement statement = QueryBuilder.delete().from(ColumnFamilyKeys.USER_ATTACHMENT_CF)
                .where(eq("username", username))
                .and(eq("attachmentId",UUID.fromString(attachmentId)));
        session.execute(statement);
    }

    public Collection<String> findAttachmentIds(String username, int pagination, String finish) {
        Select.Where where = QueryBuilder.select()
                .column("attachmentId")
                .from(ColumnFamilyKeys.USER_ATTACHMENT_CF)
                .where(eq("username", username));
        if(finish != null) {
            where.and(gt("attachmentId", UUID.fromString(finish)));
        }
        where.orderBy(desc("attachmentId")).limit(pagination);

        Statement statement = where;
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getUUID("attachmentId").toString())
                .collect(Collectors.toList());
    }

    public Collection<String> findAttachmentIds(String username) {
        Statement statement = QueryBuilder.select()
                .column("attachmentId")
                .from(ColumnFamilyKeys.USER_ATTACHMENT_CF)
                .where(eq("username", username))
                .limit(Constants.CASSANDRA_MAX_ROWS);

        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getUUID("attachmentId").toString())
                .collect(Collectors.toList());

    }
}
