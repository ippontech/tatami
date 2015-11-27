package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Group;

import java.util.UUID;

/**
 * The Group Details Repository.
 *
 * @author Julien Dubois
 */
public interface GroupDetailsRepository {

    void createGroupDetails(String groupId, String name, String description, boolean publicGroup);

    Group getGroupDetails(UUID groupId);

    void editGroupDetails(UUID groupId, String name, String description, boolean archivedGroup);
}
