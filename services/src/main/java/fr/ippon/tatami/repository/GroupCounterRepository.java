package fr.ippon.tatami.repository;

import java.util.UUID;

/**
 * The Group Counter Repository.
 *
 * @author Julien Dubois
 */
public interface GroupCounterRepository {

    long getGroupCounter(String domain, UUID groupId);

    void incrementGroupCounter(String domain, UUID groupId);

    void decrementGroupCounter(String domain, UUID groupId);

    void deleteGroupCounter(String domain, String groupId);
}
