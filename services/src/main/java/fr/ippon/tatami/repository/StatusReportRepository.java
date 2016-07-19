package fr.ippon.tatami.repository;

import java.util.Collection;
import java.util.List;

/**
 * Created by emilyklein on 7/11/16.
 */
public interface StatusReportRepository {

    void reportStatus (String reportingLogin, String reportedStatusId);

    void unreportStatus (String currentAdminLogin, String reportedStatusId);

    List<String> findReportedStatuses();

    boolean hasBeenReportedByUser(String login, String reportedStatusId);

}