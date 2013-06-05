package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.status.Status;

import java.util.List;

/**
 * The Timeline Repository.
 * <p/>
 * A Timeline is the list of statuses that a user sees, which includes :
 * - The statuses from the people he follows
 * - His own statuses
 * - Statuses that were shared by the people he follows or by himself
 *
 * @author Julien Dubois
 */
public interface TimelineRepository {

    boolean isStatusInTimeline(String login, String statusId);

    void addStatusToTimeline(String login, Status status);

    void shareStatusToTimeline(String sharedByLogin, String timelineLogin, Status status);

    void deleteTimeline(String login);

    /**
     * The user timeline : the user's statuses, and statuses from users he follows.
     * - The key is the statusId of the statuses
     * - The value is always null
     */
    List<String> getTimeline(String login, int size, String since_id, String max_id);
}
