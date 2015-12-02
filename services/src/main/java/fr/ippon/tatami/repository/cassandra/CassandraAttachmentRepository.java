package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.utils.UUIDs;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.domain.Avatar;
import fr.ippon.tatami.repository.AttachmentRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

import java.nio.ByteBuffer;
import java.util.Date;
import java.util.UUID;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static com.datastax.driver.core.querybuilder.QueryBuilder.set;
import static fr.ippon.tatami.config.ColumnFamilyKeys.ATTACHMENT_CF;

@Repository
public class CassandraAttachmentRepository implements AttachmentRepository {

    private final Logger log = LoggerFactory.getLogger(CassandraAttachmentRepository.class);

    private final String CONTENT = "content";
    private final String THUMBNAIL = "thumbnail";
    private final String FILENAME = "filename";
    private final String SIZE = "size";
    private final String CREATION_DATE = "creation_date";

    @Inject
    private Session session;

    @Override
    public void createAttachment(Attachment attachment) {

        ByteBuffer content = null;
        ByteBuffer thumbnail = null;

        if (attachment.getContent() != null) {
            content = ByteBuffer.wrap(attachment.getContent());
        }
        if (attachment.getThumbnail() != null) {
            thumbnail = ByteBuffer.wrap(attachment.getThumbnail());
        }
        UUID attachmentId = UUIDs.timeBased();
        log.debug("Creating attachment : {}", attachment);
        attachment.setAttachmentId(attachmentId.toString());
        Statement statement = QueryBuilder.insertInto(ATTACHMENT_CF)
                .value("id", UUID.fromString(attachment.getAttachmentId()))
                .value(FILENAME, attachment.getFilename())
                .value(CONTENT, content)
                .value(THUMBNAIL, thumbnail)
                .value(SIZE,attachment.getSize())
                .value(CREATION_DATE,attachment.getCreationDate());
        session.execute(statement);
    }

    @Override
    @CacheEvict(value = "attachment-cache", key = "#attachment.attachmentId")
    public void deleteAttachment(Attachment attachment) {
        log.debug("Deleting attachment : {}", attachment);
        Statement statement = QueryBuilder.delete().from(ATTACHMENT_CF)
                .where(eq("id", UUID.fromString(attachment.getAttachmentId())));
        session.execute(statement);
    }

    @Override
    @Cacheable("attachment-cache")
    public Attachment findAttachmentById(String attachmentId) {
        if (attachmentId == null) {
            return null;
        }

        log.debug("Finding attachment : {}", attachmentId);

        Attachment attachment = this.findAttachmentMetadataById(attachmentId);

        if (attachment == null) {
            return null;
        }
        Statement statement = QueryBuilder.select()
                .column(CONTENT)
                .from(ATTACHMENT_CF)
                .where(eq("id", UUID.fromString(attachmentId)));

        ResultSet results = session.execute(statement);
        attachment.setContent(results.one().getBytes(CONTENT).array());

        statement = QueryBuilder.select()
                .column(THUMBNAIL)
                .from(ATTACHMENT_CF)
                .where(eq("id", UUID.fromString(attachmentId)));

        results = session.execute(statement);
        attachment.setThumbnail(results.one().getBytes(THUMBNAIL).array());
        if (attachment.getThumbnail() != null && attachment.getThumbnail().length > 0) {
            attachment.setHasThumbnail(true);
        } else {
            attachment.setHasThumbnail(false);
        }
        return attachment;
    }

    @Override
    public Attachment findAttachmentMetadataById(String attachmentId) {
        if (attachmentId == null) {
            return null;
        }
        Statement statement = QueryBuilder.select()
                .column(FILENAME)
                .column(SIZE)
                .column(CREATION_DATE)
                .from(ATTACHMENT_CF)
                .where(eq("id", UUID.fromString(attachmentId)));

        ResultSet results = session.execute(statement);
        if (!results.isExhausted()) {
            Row row = results.one();
            Attachment attachment = new Attachment();
            attachment.setFilename(row.getString(FILENAME));
            attachment.setSize(row.getLong(SIZE));
            attachment.setCreationDate(row.getDate(CREATION_DATE));
            if (attachment.getCreationDate() == null) {
                attachment.setCreationDate(new Date());
            }
            return attachment;
        }
        return null;
    }

	@Override
	public Attachment updateThumbnail(Attachment attach) {
		log.debug("Updating thumbnail : {}", attach);
        ByteBuffer thumbnail = null;
        if (attach.getThumbnail() != null) {
            thumbnail = ByteBuffer.wrap(attach.getThumbnail());
        }
        Statement statement = QueryBuilder.update(ATTACHMENT_CF)
                .with(set(THUMBNAIL, thumbnail))
                .where(eq("id", UUID.fromString(attach.getAttachmentId())));
        session.execute(statement);
        return attach;
	}
}