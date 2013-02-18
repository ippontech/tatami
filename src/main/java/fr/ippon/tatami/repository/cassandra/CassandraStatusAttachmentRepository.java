package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.repository.StatusAttachmentRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.UUID;

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

    ColumnFamilyTemplate<String, UUID> attachmentsTemplate;

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init() {
        attachmentsTemplate = new ThriftColumnFamilyTemplate<String, UUID>(keyspaceOperator,
                STATUS_ATTACHMENT_CF,
                StringSerializer.get(),
                UUIDSerializer.get());

        attachmentsTemplate.setCount(Constants.CASSANDRA_MAX_COLUMNS);
    }

    @Override
    public void addAttachmentId(String statusId, String attachmentId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(statusId, STATUS_ATTACHMENT_CF, HFactory.createColumn(UUID.fromString(attachmentId),
                Calendar.getInstance().getTimeInMillis(), UUIDSerializer.get(), LongSerializer.get()));
    }

    @Override
    public void removeAttachmentId(String statusId, String attachmentId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(statusId, STATUS_ATTACHMENT_CF, UUID.fromString(attachmentId), UUIDSerializer.get());
    }

    @Override
    public Collection<String> findAttachmentIds(String statusId) {
        ColumnFamilyResult<String, UUID> result = attachmentsTemplate.queryColumns(statusId);
        Collection<String> attachmentIds = new ArrayList<String>();
        for (UUID columnName : result.getColumnNames()) {
            attachmentIds.add(columnName.toString());
        }
        return attachmentIds;
    }
}
