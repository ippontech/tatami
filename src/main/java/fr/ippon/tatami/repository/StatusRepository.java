package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.Status;

import javax.validation.ConstraintViolationException;
import java.util.Collection;

/**
 * The Status Repository.
 *
 * @author Julien Dubois
 */
public interface StatusRepository {

    Status createStatus(String login,
                        String username,
                        String domain,
                        boolean statusPrivate,
                        Group group,
                        Collection<String> attachmentIds,
                        String content,
                        String discussionId,
                        String replyTo,
                        String replyToUsername) throws ConstraintViolationException;

    void removeStatus(Status status);

    /**
     * Retrieve a persisted status's informations
     *
     * @return null if status was removed
     */
    Status findStatusById(String statusId);
}
