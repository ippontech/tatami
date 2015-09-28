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

    void removeMember(String groupId, String login);

    Map<String, String> findMembers(String groupId);
}
