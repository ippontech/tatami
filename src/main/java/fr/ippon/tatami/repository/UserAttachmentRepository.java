package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Stores attachement IDs for a user.
 */
public interface UserAttachmentRepository {

    void addAttachementId(String login, String attachementId);

    void removeAttachementId(String login, String attachementId);

    Collection<String> findAttachementIds(String login, int pagination);
}
