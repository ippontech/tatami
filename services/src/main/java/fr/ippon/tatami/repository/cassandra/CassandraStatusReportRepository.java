package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.StatusReportRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.OrderedRows;
import me.prettyprint.hector.api.beans.Row;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.RangeSlicesQuery;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;

import static fr.ippon.tatami.config.ColumnFamilyKeys.STATUS_REPORT_CF;

/**
 * Created by emilyklein on 7/11/16.
 */
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
    }

    @Override
    public void reportStatus(String reportingUser, String reportedStatusId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(reportedStatusId, STATUS_REPORT_CF, HFactory.createColumn(reportingUser,
                Calendar.getInstance().getTimeInMillis(), StringSerializer.get(), LongSerializer.get()));
    }

    @Override
    public void unreportStatus(String currentUserLogin, String reportedStatusId) {
        //TODO: determine whether it is being deleted or accepted -> if accepted, delete from reported table, if deleted, add to deleted table
        //TODO: HELP!!!!!


        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(reportedStatusId, STATUS_REPORT_CF, currentUserLogin, StringSerializer.get());
    }

    @Override
    public Collection<String> findReportedStatuses() {
        Collection<String> reportedStatuses = new ArrayList<String>();
        RangeSlicesQuery<String, String, String> findAll = HFactory
                .createRangeSlicesQuery(keyspaceOperator, StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(STATUS_REPORT_CF)
                .setRange(null, null, false, 10)
                .setRowCount(10);

        OrderedRows<String, String, String> result = findAll.execute().get();
        for (Row<String, String, String> row : result.getList()) {
            reportedStatuses.add(row.getKey());
        }
        return reportedStatuses;
    }

    @Override
    public boolean hasBeenReportedByUser(String login, String reportedStatusId) {
        for (String username : reportedStatusTemplate.queryColumns(reportedStatusId).getColumnNames()) {
            if (username.equals(login)) {
                return true;
            }
        }
        return false;
    }

}
