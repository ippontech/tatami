package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.status.Status;

import java.util.List;

/**
 * The Userline Repository.
 * <p/>
 * A Userline is the list of statuses updated by a user (including the statuses he shared).
 *
 * @author Julien Dubois
 */
public interface UserlineRepository {

    void addStatusToUserline(Status status);

    void shareStatusToUserline(String currentLogin, Status status);

    void deleteUserline(String login);

    /**
     * The userline : the user's statuses.
     * - The key is the statusId of the statuses
     * - The value is always null
     */
    List<String> getUserline(String login, int size, String since_id, String max_id);
}
