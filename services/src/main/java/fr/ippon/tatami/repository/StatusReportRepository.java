package fr.ippon.tatami.repository;

import java.util.Collection;
import java.util.List;

public interface StatusReportRepository {

    void reportStatus (String domain,  String reportedStatusId, String reportingLogin);

    void unreportStatus (String domain,  String reportedStatusId);

    List<String> findReportedStatuses(String domain);

    String findUserHavingReported(String domain, String statusId);

    boolean hasBeenReportedByUser(String domain, String reportedStatusId, String login);

}