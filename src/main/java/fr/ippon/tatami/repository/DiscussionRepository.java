package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.StatusDetails;

import java.util.Collection;

/**
 * The StatusDetails Repository.
 *
 * @author Julien Dubois
 */
public interface DiscussionRepository {

    void addReplyToDiscussion(String originalStatusId, String replyStatusId);

    Collection<String> findStatusIdsInDiscussion(String originalStatusId);
}
