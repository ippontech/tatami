package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Status;

import javax.validation.ConstraintViolationException;
import java.util.Collection;

/**
 * The User Respository.
 *
 * @author Julien Dubois
 */
public interface StatusRepository {

    Status createStatus(String login, String username, String domain, String content) throws ConstraintViolationException;

    void removeStatus(Status status);

    /**
     * Retrieve a persisted status's informations
     *
     * @param statusId
     * @return null if status was removed
     */
    Status findStatusById(String statusId);

    void addStatusToDayline(Status status, String key);

    void addStatusToFavoritesline(Status status, String login);

    void removeStatusFromFavoritesline(Status status, String login);

    void addStatusToUserline(Status status);

    void addStatusToTimeline(String login, Status status);

    /**
     * analyze a message in order to extract and reference eventual hashtags
     *
     * @param status
     */
    void addStatusToTagline(Status status);

    /**
     * a day's status
     */
    Collection<String> getDayline(String date);

    /**
     * a user's and his followed users status
     */
    Collection<String> getTimeline(String login, int size, String since_id, String max_id);

    /**
     * a user's own status
     */
    Collection<String> getUserline(String login, int size, String since_id, String max_id);

    /**
     * a tag's status
     *
     * @param tag cannot be null, empty, nor contain a sharp character (#)
     */
    Collection<String> getTagline(String tag, int size);

    /**
     * a user's favorite status
     */
    Collection<String> getFavoritesline(String login);
}
