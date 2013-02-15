package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.repository.UserAttachmentRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.*;

import static fr.ippon.tatami.config.ColumnFamilyKeys.USER_ATTACHMENT_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

/**
 * Cassandra implementation of the UserAttachment repository.
 * <p/>
 * Structure :
 * - Key = login
 * - Name = attachmentId
 * - Value = time
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraUserAttachmentRepository
        implements UserAttachmentRepository {

    private ColumnFamilyTemplate<String, UUID> attachmentsTemplate;

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init() {
        attachmentsTemplate = new ThriftColumnFamilyTemplate<String, UUID>(keyspaceOperator,
                USER_ATTACHMENT_CF,
                StringSerializer.get(),
                UUIDSerializer.get());

        attachmentsTemplate.setCount(Constants.CASSANDRA_MAX_COLUMNS);
    }

    @Override
    public void addAttachmentId(String login, String attachmentId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, USER_ATTACHMENT_CF, HFactory.createColumn(UUID.fromString(attachmentId),
                Calendar.getInstance().getTimeInMillis(), UUIDSerializer.get(), LongSerializer.get()));
    }

    @Override
    public void removeAttachmentId(String login, String attachmentId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(login, USER_ATTACHMENT_CF, UUID.fromString(attachmentId), UUIDSerializer.get());
    }

    @Override
    public Collection<String> findAttachmentIds(String login, int pagination) {
        ColumnSlice<UUID, Long> query = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), UUIDSerializer.get(), LongSerializer.get())
                .setColumnFamily(USER_ATTACHMENT_CF)
                .setKey(login)
                .setRange(null, null, true, pagination + Constants.PAGINATION_SIZE)
                .execute()
                .get();

        List<HColumn<UUID, Long>> result = query.getColumns();
        Collection<String> attachmentIds = new ArrayList<String>();
        int index = 0;
        for (HColumn<UUID, Long> column : result) {
            if (index > pagination + Constants.PAGINATION_SIZE) {
                break;
            }
            if (index >= pagination) {
                attachmentIds.add(column.getName().toString());
            }
            index++;
        }
        return attachmentIds;
    }

    @Override
    public Collection<String> findAttachmentIds(String login) {
        ColumnFamilyResult<String, UUID> result = attachmentsTemplate.queryColumns(login);
        Collection<String> attachmentIds = new ArrayList<String>();
        for (UUID columnName : result.getColumnNames()) {
            attachmentIds.add(columnName.toString());
        }
        return attachmentIds;
    }
}
