package fr.ippon.tatami.repository;

import java.util.Collection;
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
    void addStatusToGroupline(String groupId, String statusId);

    /**
     * Remove a collection of statuses from the Group line.
     */
    void removeStatusesFromGroupline(String groupId, Collection<String> statusIdsToDelete);

    /**
     * The Groupline : the statuses for a given group.
     * - The name is the statusId of the statuses
     * - Value is always null
     */
    List<String> getGroupline(String groupId, int size, String start, String finish);
}
