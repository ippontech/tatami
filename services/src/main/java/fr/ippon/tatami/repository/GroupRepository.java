package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Group;

import java.util.UUID;

/**
 * The Group Repository.
 *
 * @author Julien Dubois
 */
public interface GroupRepository {

    UUID createGroup(String domain, String name, String description, boolean publicGroup);

    Group getGroupById(String domain, UUID groupId);
}
