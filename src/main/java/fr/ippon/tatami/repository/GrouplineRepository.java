package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.status.Status;

import java.util.List;

/**
 * The Groupline Repository.
 *
 * @author Julien Dubois
 */
public interface GrouplineRepository {

    /**
     * Add a status to the Group line.
     */
    void addStatusToGroupline(Status status, String groupId);

    /**
     * The Groupline : the statuses for a given group.
     * - The name is the statusId of the statuses
     * - Value is always null
     */
    List<String> getGroupline(String groupId, int size, String since_id, String max_id);
}
