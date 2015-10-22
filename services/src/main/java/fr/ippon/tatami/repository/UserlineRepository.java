package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.status.Share;

import java.util.Collection;
import java.util.List;

/**
 * The Userline Repository.
 * <p/>
 * A Userline is the list of statuses updated by a user (including the statuses he shared).
 *
 * @author Julien Dubois
 */
public interface UserlineRepository {

    /**
     * Add a status to the user line.
     */
    void addStatusToUserline(String login, String statusId);

    /**
     * Remove a collection of statuses from the user line.
     */
    void removeStatusesFromUserline(String login, Collection<String> statusIdsToDelete);

    void shareStatusToUserline(String currentLogin, Share share);

    void deleteUserline(String login);

    /**
     * The userline : the user's statuses.
     * - The key is the statusId of the statuses
     * - The value is always null
     */
    List<String> getUserline(String login, int size, String start, String finish);
}
