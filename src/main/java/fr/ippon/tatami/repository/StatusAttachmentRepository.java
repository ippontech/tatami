package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Stores attachement IDs for a status.
 */
public interface StatusAttachmentRepository {

    void addAttachementId(String statusId, String attachementId);

    void removeAttachementId(String statusId, String attachementId);

    Collection<String> findAttachementIds(String statusId);
}
