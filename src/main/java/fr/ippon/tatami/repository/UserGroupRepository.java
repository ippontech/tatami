package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * The User group Repository.
 *
 * @author Julien Dubois
 */
public interface UserGroupRepository {

    void addGroupAsMember(String login, String groupId);

    void addGroupAsAdmin(String login, String groupId);

    void removeGroup(String login, String groupId);

    Collection<String> findGroups(String login);
}
