package fr.ippon.tatami.repository;

import java.util.Collection;
import java.util.List;

/**
 * The Mentionline Repository.
 *
 * @author Julien Dubois
 */
public interface MentionlineRepository {

    /**
     * Add a status to the Mention line.
     */
    void addStatusToMentionline(String mentionedLogin, String statusId);

    /**
     * Remove a collection of statuses from the Mention line.
     */
    void removeStatusesFromMentionline(String mentionedLogin, Collection<String> statusIdsToDelete);

    /**
     * The mention line : the mentions for a given user.
     * - The name is the statusId of the statuses
     * - Value is always null
     */
    List<String> getMentionline(String login, int size, String start, String finish);
}
