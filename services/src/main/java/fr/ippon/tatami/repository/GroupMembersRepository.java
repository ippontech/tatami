package fr.ippon.tatami.repository;

import java.util.Map;
import java.util.UUID;

/**
 * The Group members Repository.
 *
 * @author Julien Dubois
 */
public interface GroupMembersRepository {

    void addMember(UUID groupId, String login);

    void addAdmin(UUID groupId, String login);

    void removeMember(UUID groupId, String login);

    Map<String, String> findMembers(UUID groupId);
}
