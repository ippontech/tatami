package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Created by emilyklein on 7/13/16.
 */
public interface ResolvedReportRepository {

    void resolvedReport (String reportingUser, String reportedStatusId, Long timeReported, String adminResolved, String actionTaken);

    Collection<String> findResolvedReportsById(String statusId);

    boolean hasBeenResolved(String statusId);

}
