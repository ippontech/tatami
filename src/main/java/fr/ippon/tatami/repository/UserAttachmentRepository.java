package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Stores attachment IDs for a user.
 */
public interface UserAttachmentRepository {

    void addAttachmentId(String login, String attachmentId);

    void removeAttachmentId(String login, String attachmentId);

    Collection<String> findAttachmentIds(String login, int pagination);

    Collection<String> findAttachmentIds(String login);
}
