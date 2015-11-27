package fr.ippon.tatami.repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * The User group Repository.
 *
 * @author Julien Dubois
 */
public interface UserGroupRepository {

    void addGroupAsMember(String login, UUID groupId);

    void addGroupAsAdmin(String login, UUID groupId);

    void removeGroup(String login, UUID groupId);

    List<UUID> findGroups(String login);

    Collection<UUID> findGroupsAsAdmin(String login);
}
