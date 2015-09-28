package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.status.Status;

import java.util.Collection;
import java.util.List;

/**
 * The Tagline Repository.
 *
 * @author Julien Dubois
 */
public interface TaglineRepository {

    /**
     * Add a status to the Tag line.
     */
    void addStatusToTagline(String tag, Status status);

    /**
     * Remove a collection of statuses from the Tag line.
     */
    void removeStatusesFromTagline(String tag, String domain, Collection<String> statusIdsToDelete);

    /**
     * The tagline : the statuses for a given tag.
     * - The name is the statusId of the statuses
     * - Value is always null
     */
    List<String> getTagline(String domain, String tag, int size, String start, String finish);
}
