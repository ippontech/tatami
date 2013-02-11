package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.repository.AttachmentRepository;
import me.prettyprint.cassandra.serializers.BytesArraySerializer;
import me.prettyprint.cassandra.serializers.DateSerializer;
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
import java.util.Date;

import static fr.ippon.tatami.config.ColumnFamilyKeys.ATTACHMENT_CF;

@Repository
public class CassandraAttachmentRepository implements AttachmentRepository {

    private final Log log = LogFactory.getLog(CassandraAttachmentRepository.class);

    private final String CONTENT = "content";
    private final String FILENAME = "filename";
    private final String SIZE = "size";
    private final String CREATION_DATE = "creation_date";

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void createAttachment(Attachment attachment) {

        String attachmentId = TimeUUIDUtils.getUniqueTimeUUIDinMillis().toString();
        if (log.isDebugEnabled()) {
            log.debug("Creating attachment : " + attachment);
        }

        attachment.setAttachmentId(attachmentId);
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());

        mutator.insert(attachmentId, ATTACHMENT_CF, HFactory.createColumn(CONTENT,
                attachment.getContent(), StringSerializer.get(), BytesArraySerializer.get()));

        mutator.insert(attachmentId, ATTACHMENT_CF, HFactory.createColumn(FILENAME,
                attachment.getFilename(), StringSerializer.get(), StringSerializer.get()));

        mutator.insert(attachmentId, ATTACHMENT_CF, HFactory.createColumn(SIZE,
                attachment.getSize(), StringSerializer.get(), LongSerializer.get()));

        mutator.insert(attachmentId, ATTACHMENT_CF, HFactory.createColumn(CREATION_DATE,
                attachment.getCreationDate(), StringSerializer.get(), DateSerializer.get()));

    }

    @Override
    @CacheEvict(value = "attachment-cache", key = "#attachment.attachmentId")
    public void deleteAttachment(Attachment attachment) {
        if (log.isDebugEnabled()) {
            log.debug("Deleting attachment : " + attachment);
        }
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(attachment.getAttachmentId(), ATTACHMENT_CF);
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

        if (attachment == null) {
            return null;
        }

        ColumnQuery<String, String, byte[]> queryAttachment = HFactory.createColumnQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), BytesArraySerializer.get());

        HColumn<String, byte[]> columnAttachment =
                queryAttachment.setColumnFamily(ATTACHMENT_CF)
                        .setKey(attachmentId)
                        .setName(CONTENT)
                        .execute()
                        .get();

        attachment.setContent(columnAttachment.getValue());
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

        if (columnFilename != null && columnFilename.getValue() != null) {
            attachment.setFilename(columnFilename.getValue());
        } else {
            return null;
        }

        ColumnQuery<String, String, Long> querySize = HFactory.createColumnQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), LongSerializer.get());

        HColumn<String, Long> columnSize =
                querySize.setColumnFamily(ATTACHMENT_CF)
                        .setKey(attachmentId)
                        .setName(SIZE)
                        .execute()
                        .get();

        if (columnSize != null && columnSize.getValue() != null) {
            attachment.setSize(columnSize.getValue());
        } else {
            return null;
        }

        ColumnQuery<String, String, Date> queryCreationDate = HFactory.createColumnQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), DateSerializer.get());

        HColumn<String, Date> columnCreationDate =
                queryCreationDate.setColumnFamily(ATTACHMENT_CF)
                        .setKey(attachmentId)
                        .setName(CREATION_DATE)
                        .execute()
                        .get();

        if (columnCreationDate != null && columnCreationDate.getValue() != null) {
            attachment.setCreationDate(columnCreationDate.getValue());
        } else {
            attachment.setCreationDate(new Date());
        }

        return attachment;
    }
}