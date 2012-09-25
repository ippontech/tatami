package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * The User groups Repository.
 *
 * @author Julien Dubois
 */
public interface UserGroupsRepository {

    void addGroupAsMember(String login, String groupId);

    void addGroupAsAdmin(String login, String groupId);

    void removeGroup(String login, String groupId);

    Collection<String> findGroups(String login);
}
