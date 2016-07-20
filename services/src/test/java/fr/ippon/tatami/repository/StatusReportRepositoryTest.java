package fr.ippon.tatami.repository;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import org.junit.Test;

import javax.inject.Inject;
import java.util.Collection;

import static junit.framework.TestCase.*;

/**
 * Created by emilyklein on 7/13/16.
 */
public class StatusReportRepositoryTest extends AbstractCassandraTatamiTest {

    @Inject
    public StatusReportRepository statusReportRepository;

    @Test
    public void reportNewStatus() {

        String reportingLogin = "user@localhost";
        String reportedStatusId = "12345";
        String login = "emily@localhost";

        int sizeOfReported = statusReportRepository.findReportedStatuses().size();

        statusReportRepository.reportStatus(reportingLogin, reportedStatusId);
        Collection<String> reportedStatuses = statusReportRepository.findReportedStatuses();
        //Now it should be equal to 1, since I added 1 reported status...
        assertEquals(sizeOfReported + 1, reportedStatuses.size());

        assertFalse(statusReportRepository.hasBeenReportedByUser(login, reportedStatusId));
        assertTrue(statusReportRepository.hasBeenReportedByUser(reportingLogin, reportedStatusId));

    }


}
