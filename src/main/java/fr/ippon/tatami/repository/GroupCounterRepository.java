package fr.ippon.tatami.repository;

/**
 * The Group Counter Repository.
 *
 * @author Julien Dubois
 */
public interface GroupCounterRepository {

    long getGroupCounter(String domain, String groupId);

    void incrementGroupCounter(String domain, String groupId);

    void decrementGroupCounter(String domain, String groupId);

    void deleteGroupCounter(String domain, String groupId);
}
