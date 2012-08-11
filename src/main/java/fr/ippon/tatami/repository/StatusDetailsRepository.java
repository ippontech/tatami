package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.StatusDetails;

/**
 * The StatusDetails Repository.
 *
 * @author Julien Dubois
 */
public interface StatusDetailsRepository {

    void addDiscussionStatusId(String statusId, String replyStatusId);

    void addSharedByLogin(String statusId, String sharedByLogin);

    StatusDetails findStatusDetails(String statusId);
}
