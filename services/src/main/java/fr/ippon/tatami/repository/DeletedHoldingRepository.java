package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Created by emilyklein on 7/13/16.
 */
public interface DeletedHoldingRepository {

    void deletedReportedStatus (String reportingUser, String reportedStatusId, Long timeReported, String adminResolved, Long adminTime);

    Collection<String> findDeletedById(String statusId);

    Collection<String> findAllDeleted();

    boolean hasBeenDeleted(String statusId);

}

