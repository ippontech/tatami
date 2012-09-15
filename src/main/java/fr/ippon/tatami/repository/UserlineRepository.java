package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;

import java.util.Map;

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
     * - The value is who shared the statuses (or null if it wasn't shared)
     */
    Map<String, SharedStatusInfo> getUserline(String login, int size, String since_id, String max_id);
}
