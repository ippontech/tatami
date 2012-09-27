package fr.ippon.tatami.repository;

import java.util.Collection;

import fr.ippon.tatami.domain.Status;

/**
 * The StatusDetails Repository.
 *
 * @author Julien Dubois
 */
public interface DiscussionRepository {

    void addReplyToDiscussion(String originalStatusId, String replyStatusId);

    Collection<String> findStatusIdsInDiscussion(String originalStatusId);

	boolean hasReply(String string);
}
