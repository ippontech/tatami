package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * The Conversation Repository.
 *
 * @author Julien Dubois
 */
public interface ConversationRepository {

    /**
     * Add a status to a conversation.
     */
    void addStatusToConversation(String conversationId, String statusId);

    /**
     * Get the status Ids in a given conversation.
     */
    Collection<String> getStatusIdsInConversation(String conversationId);
}
