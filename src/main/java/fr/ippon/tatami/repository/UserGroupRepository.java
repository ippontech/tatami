package fr.ippon.tatami.repository;

import java.util.Collection;
import java.util.List;

/**
 * The User group Repository.
 *
 * @author Julien Dubois
 */
public interface UserGroupRepository {

    void addGroupAsMember(String login, String groupId);

    void addGroupAsAdmin(String login, String groupId);

    void removeGroup(String login, String groupId);

    List<String> findGroups(String login);

    Collection<String> findGroupsAsAdmin(String login);
}
