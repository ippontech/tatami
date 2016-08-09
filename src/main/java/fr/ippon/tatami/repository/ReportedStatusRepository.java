package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;

/**
 * Created by emilyklein on 7/26/16.
 * <p>
 * Cassandra implementation of the Userline repository.
 * <p/>
 * Structure :
 * - Key : username
 * - Name : status Id
 * - Value : ""
 */
@Repository
public class ReportedStatusRepository {

    @Inject
    private Session session;

    public static final String DOMAIN = "domain";
    public static final String STATUS_ID = "statusId";
    public static final String REPORTING_LOGIN = "reportingLogin";

    public void reportStatus(String domain, String reportedStatusID, String reportingLogin) {
        Statement statement = QueryBuilder.insertInto(ColumnFamilyKeys.REPORTED_STATUS_CF)
            .value(DOMAIN, domain)
            .value(STATUS_ID, reportedStatusID)
            .value(REPORTING_LOGIN, reportingLogin);
        session.execute(statement);
    }

    public void unreportStatus(String domain, String statusId) {
        Statement statement = QueryBuilder.delete().from(ColumnFamilyKeys.REPORTED_STATUS_CF)
            .where(eq(DOMAIN, domain))
            .and(eq(STATUS_ID, statusId));
        session.execute(statement);
    }

    public List<String> findReportedStatuses(String domain) {
        Statement statement = QueryBuilder.select()
            .all()
            .from(ColumnFamilyKeys.REPORTED_STATUS_CF)
            .where(eq(DOMAIN, domain));
        ResultSet results = session.execute(statement);
        return results
            .all()
            .stream()
            .map(e -> e.getString(STATUS_ID))
            .collect(Collectors.toList());
    }

}

