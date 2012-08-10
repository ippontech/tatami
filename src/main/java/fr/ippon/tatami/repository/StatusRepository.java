package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Status;

import javax.validation.ConstraintViolationException;
import java.util.Collection;

/**
 * The Status Repository.
 *
 * @author Julien Dubois
 */
public interface StatusRepository {

    Status createStatus(String login, String username, String domain, String content, String replyTo) throws ConstraintViolationException;

    void removeStatus(Status status);

    /**
     * Retrieve a persisted status's informations
     *
     * @return null if status was removed
     */
    Status findStatusById(String statusId);

    void addStatusToFavoritesline(Status status, String login);

    void removeStatusFromFavoritesline(Status status, String login);

    void addStatusToUserline(Status status);

    void addStatusToTimeline(String login, Status status);

    void deleteFavoritesline(String login);

    void deleteUserline(String login);

    void deleteTimeline(String login);

    /**
     * a user's and his followed users status
     */
    Collection<String> getTimeline(String login, int size, String since_id, String max_id);

    /**
     * a user's own status
     */
    Collection<String> getUserline(String login, int size, String since_id, String max_id);

    /**
     * a user's favorite status
     */
    Collection<String> getFavoritesline(String login);
}
