package fr.ippon.tatami.repository;

import com.datastax.driver.core.*;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.utils.UUIDs;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.*;

import fr.ippon.tatami.domain.Group;
import java.util.stream.Collectors;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;

import java.util.Map;
import java.util.UUID;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static com.datastax.driver.core.querybuilder.QueryBuilder.set;

/**
 * Created by emilyklein on 7/26/16.
 *
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

    public static final String REPORTED_STATUS = "reportedStatus";
    public static final String DOMAIN = "domain";
    public static final String STATUS_ID = "role";
    public static final String REPORTING_LOGIN = "groupId";

    @PostConstruct
    public void init(){
        //TODO: Initially create table here?  Do I need to do something else????
    }

    public void reportStatus(String domain, String reportedStatusID, String reportingLogin){
        Statement statement = QueryBuilder.insertInto(REPORTED_STATUS)
            .value(DOMAIN, domain)
            .value(STATUS_ID, reportedStatusID)
            .value(REPORTING_LOGIN, reportingLogin);
        session.execute(statement);

    }

    public void unreportStatus(String domain, String statusId){
        Statement statement = QueryBuilder.delete().from(REPORTED_STATUS)
            .where(eq(DOMAIN, domain))
            .and(eq(STATUS_ID, statusId));
        session.execute(statement);
    }

    public List<String> findReportedStatuses (String domain){
        Statement statement = QueryBuilder.select()
            .all()
            .from(REPORTED_STATUS)
            .where(eq(DOMAIN, domain));
        ResultSet results = session.execute(statement);
        return results
            .all()
            .stream()
            .map(e -> e.getString(STATUS_ID))
            .collect(Collectors.toList());
    }


    //TODO: Is this used at all???
    public String findUserHavingReported(String domain, String statusId){
        String user = "";
        return domain;
    }

    //TODO: Is this used at all???
    public boolean hasBeenReportedByUser(String domain, String reportedStatusId, String login){
        boolean var = true;
        return var;
    }

}

