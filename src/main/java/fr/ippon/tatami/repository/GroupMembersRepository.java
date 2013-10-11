package fr.ippon.tatami.repository;

import java.util.Map;

/**
 * The Group members Repository.
 *
 * @author Julien Dubois
 */
public interface GroupMembersRepository {

    void addMember(String groupId, String login);

    void addAdmin(String groupId, String login);
    
    void requestApproval(String groupId, String login);
    
    void acceptRequest(String groupId, String login);
    
    void rejectRequest(String groupId, String login);
    
    boolean isUserWaitingForApproval(String groupId, String login);

    void removeMember(String groupId, String login);

    Map<String, String> findMembers(String groupId);
    
    Map<String, String> findPendingMembers(String groupId);
}
