package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;

import java.util.Map;

/**
 * The Mentionline Repository.
 *
 * @author Julien Dubois
 */
public interface MentionlineRepository {

    /**
     * Add a status to the Mention line.
     */
    void addStatusToMentionline(String mentionedLogin, Status status);

    /**
     * The mention line : the mentions for a given user.
     * - The name is the statusId of the statuses
     * - Value is always null : this is to be consistent with the Timeline & Userline API,
     * which returns Map<String, String>
     */
    Map<String, SharedStatusInfo> getMentionline(String login, int size, String since_id, String max_id);
}
