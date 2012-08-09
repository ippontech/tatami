package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * The Discussion Repository.
 *
 * @author Julien Dubois
 */
public interface DiscussionRepository {

    /**
     * Add a status to a discussion.
     */
    void addStatusToDiscussion(String discussionId, String statusId);

    /**
     * Get the status Ids in a given discussion.
     */
    Collection<String> getStatusIdsInDiscussion(String discussionId);
}
