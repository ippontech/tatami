package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Group;

/**
 * The Group Details Repository.
 *
 * @author Julien Dubois
 */
public interface GroupDetailsRepository {

    void createGroupDetails(String groupId, String name, String description, boolean publicGroup);

    Group getGroupDetails(String groupId);

    void editGroupDetails(String groupId, String name, String description, boolean archivedGroup);
}
