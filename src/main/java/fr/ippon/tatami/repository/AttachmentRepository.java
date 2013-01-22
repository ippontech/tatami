package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Attachment;

public interface AttachmentRepository {

    void createAttachment(Attachment attach);

    void deleteAttachment(Attachment attach);

    /**
     * Finds an attachment, including its content (the file data).
     */
    Attachment findAttachmentById(String attachmentId);

    /**
     * Only fetch the attachment metadata : file name & size, but not its content.
     */
    Attachment findAttachmentMetadataById(String attachmentId);
}