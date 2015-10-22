package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Stores attachment IDs for a status.
 */
public interface StatusAttachmentRepository {

    void addAttachmentId(String statusId, String attachmentId);

    void removeAttachmentId(String statusId, String attachmentId);

    Collection<String> findAttachmentIds(String statusId);
}
