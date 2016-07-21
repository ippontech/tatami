package fr.ippon.tatami.repository;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import org.junit.Test;

import javax.inject.Inject;
import java.util.Collection;

import static junit.framework.TestCase.*;

public class StatusReportRepositoryTest extends AbstractCassandraTatamiTest {

    @Inject
    public StatusReportRepository statusReportRepository;

    @Test
    public void reportNewStatus() {

        String reportingLogin = "user@localhost";
        String reportedStatusId = "status-id";
        String login = "emily@localhost";
        String domain = "localhost";

        int sizeOfReported = statusReportRepository.findReportedStatuses(domain).size();

        statusReportRepository.reportStatus(domain, reportedStatusId, reportingLogin);
        Collection<String> reportedStatuses = statusReportRepository.findReportedStatuses(domain);
        String reporter = statusReportRepository.findUserHavingReported(domain, reportedStatusId);

        //Now it should be equal to 1, since I added 1 reported status...
        assertEquals(sizeOfReported + 1, reportedStatuses.size());
        assertEquals(reporter, reportingLogin);

        assertFalse(statusReportRepository.hasBeenReportedByUser(domain, reportedStatusId, login));
        assertTrue(statusReportRepository.hasBeenReportedByUser(domain, reportedStatusId, reportingLogin));

        sizeOfReported = statusReportRepository.findReportedStatuses(domain).size();
        statusReportRepository.unreportStatus(domain, reportedStatusId);
        reportedStatuses = statusReportRepository.findReportedStatuses(domain);
        assertEquals(sizeOfReported - 1, reportedStatuses.size());

    }



}
