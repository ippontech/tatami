package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.status.Status;

import java.util.List;

/**
 * The Tagline Repository.
 *
 * @author Julien Dubois
 */
public interface TaglineRepository {

    /**
     * Analyze a message in order to extract and reference eventual hashtags.
     */
    void addStatusToTagline(Status status, String tag);

    /**
     * The tagline : the statuses for a given tag.
     * - The name is the statusId of the statuses
     * - Value is always null
     */
    List<String> getTagline(String domain, String tag, int size, String since_id, String max_id);
}
