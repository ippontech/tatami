package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.repository.AttachmentRepository;
import me.prettyprint.cassandra.serializers.BytesArraySerializer;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.utils.TimeUUIDUtils;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.ColumnQuery;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

import static fr.ippon.tatami.config.ColumnFamilyKeys.ATTACHMENT_CF;

@Repository
public class CassandraAttachmentRepository implements AttachmentRepository {

    private final Log log = LogFactory.getLog(CassandraAttachmentRepository.class);

    private final String CONTENT = "content";
    private final String FILENAME = "filename";
    private final String SIZE = "size";

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void createAttachment(Attachment attachement) {
        if (log.isDebugEnabled()) {
            log.debug("Creating attachment : " + attachement);
        }
        String attachementId = TimeUUIDUtils.getUniqueTimeUUIDinMillis().toString();
        attachement.setAttachmentId(attachementId);
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());

        mutator.insert(attachementId, ATTACHMENT_CF, HFactory.createColumn(CONTENT,
                attachement.getContent(), StringSerializer.get(), BytesArraySerializer.get()));

        mutator.insert(attachementId, ATTACHMENT_CF, HFactory.createColumn(FILENAME,
                attachement.getFilename(), StringSerializer.get(), StringSerializer.get()));

        mutator.insert(attachementId, ATTACHMENT_CF, HFactory.createColumn(SIZE,
                attachement.getSize(), StringSerializer.get(), LongSerializer.get()));

    }

    @Override
    @CacheEvict(value = "attachment-cache", key = "#attachment.attachmentId")
    public void deleteAttachment(Attachment attachement) {
        if (log.isDebugEnabled()) {
            log.debug("Deleting attachement : " + attachement);
        }
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(attachement.getAttachmentId(), ATTACHMENT_CF);
        mutator.execute();
    }

    @Override
    @Cacheable("attachment-cache")
    public Attachment findAttachmentById(String attachmentId) {
        if (attachmentId == null) {
            return null;
        }
        if (log.isDebugEnabled()) {
            log.debug("Finding attachment : " + attachmentId);
        }
        Attachment attachment = this.findAttachmentMetadataById(attachmentId);

        ColumnQuery<String, String, byte[]> queryAttachement = HFactory.createColumnQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), BytesArraySerializer.get());

        HColumn<String, byte[]> columnAttachement =
                queryAttachement.setColumnFamily(ATTACHMENT_CF)
                        .setKey(attachmentId)
                        .setName(CONTENT)
                        .execute()
                        .get();

        attachment.setContent(columnAttachement.getValue());
        return attachment;
    }

    @Override
    public Attachment findAttachmentMetadataById(String attachmentId) {
        if (attachmentId == null) {
            return null;
        }
        Attachment attachment = new Attachment();
        attachment.setAttachmentId(attachmentId);

        ColumnQuery<String, String, String> queryFilename = HFactory.createColumnQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get());

        HColumn<String, String> columnFilename =
                queryFilename.setColumnFamily(ATTACHMENT_CF)
                        .setKey(attachmentId)
                        .setName(FILENAME)
                        .execute()
                        .get();

        attachment.setFilename(columnFilename.getValue());

        ColumnQuery<String, String, Long> querySize = HFactory.createColumnQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), LongSerializer.get());

        HColumn<String, Long> columnSize =
                querySize.setColumnFamily(ATTACHMENT_CF)
                        .setKey(attachmentId)
                        .setName(SIZE)
                        .execute()
                        .get();

        if (columnSize.getValue() != null) {
            attachment.setSize(columnSize.getValue());
        } else {
            attachment.setSize(0);
        }

        return attachment;
    }
}