package fr.ippon.tatami.repository;

import java.util.List;

import fr.ippon.tatami.domain.Status;

import javax.validation.ConstraintViolationException;

/**
 * The Status Repository.
 *
 * @author Julien Dubois
 */
public interface StatusRepository {

    Status createStatus(String login,
                        String username,
                        String domain,
                        String content,
                        String replyTo,
                        String replyToUsername,
                        List<String> tags) throws ConstraintViolationException;

    void removeStatus(Status status);

    /**
     * Retrieve a persisted status's informations
     *
     * @return null if status was removed
     */
    Status findStatusById(String statusId);
}
