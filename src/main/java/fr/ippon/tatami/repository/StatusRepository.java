package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Status;

import javax.validation.ConstraintViolationException;
import java.util.Map;

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
                        String replyToUsername) throws ConstraintViolationException;

    void removeStatus(Status status);

    /**
     * Retrieve a persisted status's informations
     *
     * @return null if status was removed
     */
    Status findStatusById(String statusId);

    void addStatusToTimeline(String login, Status status);

    void shareStatusToTimeline(String sharedByLogin, String timelineLogin, Status status);

    void addStatusToUserline(Status status);

    void shareStatusToUserline(String currentLogin, Status status);

    void deleteUserline(String login);

    void deleteTimeline(String login);

    /**
     * The user timeline : the user's statuses, and statuses from users he follows.
     * - The key is the statusId of the statuses
     * - The value is who shared the statuses (or null if it wasn't shared)
     */
    Map<String, String> getTimeline(String login, int size, String since_id, String max_id);

    /**
     * The userline : the user's statuses.
     * - The key is the statusId of the statuses
     * - The value is who shared the statuses (or null if it wasn't shared)
     */
    Map<String, String> getUserline(String login, int size, String since_id, String max_id);
}
