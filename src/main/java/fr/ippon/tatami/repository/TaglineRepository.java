package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Status;

import java.util.Map;

/**
 * The Tagline Repository.
 *
 * @author Julien Dubois
 */
public interface TaglineRepository {

    /**
     * Analyze a message in order to extract and reference eventual hashtags.
     *
     * @param status
     */
    void addStatusToTagline(Status status, String domain);

    /**
     * The tagline : the statuses for a given tag.
     * - The key is the statusId of the statuses
     * - Value is always null : this is to be consistent with the Timeline & Userline API,
     * which returns Map<String, String>
     */
    Map<String, String> getTagline(String domain, String tag, int size);
}
