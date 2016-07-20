package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.repository.StatusReportRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.OrderedRows;
import me.prettyprint.hector.api.beans.Row;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.QueryResult;
import me.prettyprint.hector.api.query.RangeSlicesQuery;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.*;

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
        reportedStatusTemplate.setCount(Constants.CASSANDRA_MAX_COLUMNS);
    }

    @Override
    public void reportStatus(String reportingUser, String reportedStatusId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(reportedStatusId, STATUS_REPORT_CF, HFactory.createColumn(reportingUser,
                Calendar.getInstance().getTimeInMillis(), StringSerializer.get(), LongSerializer.get()));
    }

    @Override
    public void unreportStatus(String currentUserLogin, String reportedStatusId) {


        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(reportedStatusId, STATUS_REPORT_CF, currentUserLogin, StringSerializer.get());
    }

    @Override
    public List<String> findReportedStatuses() {
        List<String> reportedStatuses = new ArrayList<String>();
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

        /*Map<String, Integer> resultMap = new HashMap<String, Integer>();
        String lastKeyForMissing = "";
        StringSerializer s = StringSerializer.get();
        RangeSlicesQuery<String, String, String> allRowsQuery = HFactory.createRangeSlicesQuery(keyspaceOperator, s, s, s);
        allRowsQuery.setColumnFamily(STATUS_REPORT_CF);
        allRowsQuery.setRange("", "", false, 3);    //retrieve 3 columns, no reverse
        allRowsQuery.setReturnKeysOnly();    //enable this line if we want key only
        allRowsQuery.setRowCount(100);
        int rowCnt = 0;
        while (true) {
            allRowsQuery.setKeys(lastKeyForMissing, "");
            QueryResult<OrderedRows<String, String, String>> res = allRowsQuery.execute();
            OrderedRows<String, String, String> rows = res.get();
            lastKeyForMissing = rows.peekLast().getKey();
            for (Row<String, String, String> aRow : rows) {
                if (!resultMap.containsKey(aRow.getKey())) {
                    resultMap.put(aRow.getKey(), ++rowCnt);
                    reportedStatuses.add(aRow.getKey());
                    System.out.println(aRow.getKey() + ":" + rowCnt);
                }
            }
            if (rows.getCount() != 100) {
                break;
            }
        }*/
        //return reportedStatuses;
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
