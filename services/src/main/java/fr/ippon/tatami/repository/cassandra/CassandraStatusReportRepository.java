package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.config.GroupRoles;
import fr.ippon.tatami.repository.StatusReportRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.ColumnSliceIterator;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ColumnFamilyUpdater;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.exceptions.HectorException;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.SliceQuery;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.*;

import static fr.ippon.tatami.config.ColumnFamilyKeys.GROUP_MEMBERS_CF;
import static fr.ippon.tatami.config.ColumnFamilyKeys.STATUS_REPORT_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;


@Repository
public class CassandraStatusReportRepository implements StatusReportRepository {

    private ColumnFamilyTemplate<String, String> reportedStatusTemplate;

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init() {
        reportedStatusTemplate = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator,
                STATUS_REPORT_CF,
                StringSerializer.get(),
                StringSerializer.get());
        reportedStatusTemplate.setCount(Constants.CASSANDRA_MAX_COLUMNS);
    }

    @Override
    public void reportStatus(String domain,  String reportedStatusId, String reportingLogin) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(domain, STATUS_REPORT_CF, HFactory.createStringColumn(reportedStatusId, reportingLogin));
    }

    @Override
    public void unreportStatus(String domain,  String reportedStatusId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(domain, STATUS_REPORT_CF, reportedStatusId, StringSerializer.get());
    }

    @Override
    public List<String> findReportedStatuses(String domain) {
        SliceQuery<String, String, String> query = HFactory.createSliceQuery(keyspaceOperator, StringSerializer.get(),
                StringSerializer.get(), StringSerializer.get()).
                setKey(domain).setColumnFamily(STATUS_REPORT_CF);

        ColumnSliceIterator<String, String, String> iterator =
                new ColumnSliceIterator<String, String, String>(query, null, "\uFFFF", false);

        List<String> reportedStatuses = new ArrayList<String>();
        while (iterator.hasNext()) {
            reportedStatuses.add(iterator.next().getName());
        }
        return reportedStatuses;
    }

    public String findUserHavingReported(String domain, String statusId){
        ColumnFamilyResult<String, String> res = reportedStatusTemplate.queryColumns(domain);
        return res.getString(statusId);
    }

    @Override
    public boolean hasBeenReportedByUser(String domain, String reportedStatusId, String login) {
        return login.equals(reportedStatusTemplate.queryColumns(domain).getString(reportedStatusId));
    }

}
