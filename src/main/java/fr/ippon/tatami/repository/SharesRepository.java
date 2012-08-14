package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.StatusDetails;

import java.util.Collection;

/**
 * The StatusDetails Repository.
 *
 * @author Julien Dubois
 */
public interface SharesRepository {

    void newShareByLogin(String statusId, String sharedByLogin);

    Collection<String> findLoginsWhoSharedAStatus(String statusId);
}
