package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * The StatusDetails Repository.
 *
 * @author Julien Dubois
 */
public interface SharesRepository {

    void newShareByLogin(String statusId, String sharedByLogin);

    Collection<String> findLoginsWhoSharedAStatus(String statusId);

    boolean hasBeenShared(String statusId);
}
