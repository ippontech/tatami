package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.repository.DeletedHoldingRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;

import static fr.ippon.tatami.config.ColumnFamilyKeys.DELETED_STATUSES_CF;

/**
 * Created by emilyklein on 7/13/16.
 */
public class CassandraDeletedHoldingRepository implements DeletedHoldingRepository{

    private ColumnFamilyTemplate<String, String> deletedStatusTemplate;

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init(){
        deletedStatusTemplate = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator,
                DELETED_STATUSES_CF,
                StringSerializer.get(),
                StringSerializer.get());
        deletedStatusTemplate.setCount(Constants.CASSANDRA_MAX_COLUMNS);
    }

    @Override
    public void deletedReportedStatus(String reportingUser, String reportedStatusId, Long timeReported, String adminResolved, Long adminTime) {

        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());

        //TODO: HELP! I don't know if this is correct
        mutator.insert(reportedStatusId, DELETED_STATUSES_CF,
                HFactory.createColumn(
                        reportingUser,
                        timeReported,
                        StringSerializer.get(),
                        LongSerializer.get()
                ));
        mutator.insert(reportedStatusId,DELETED_STATUSES_CF,
                HFactory.createColumn(adminResolved,
                        adminTime,
                        StringSerializer.get(),
                        LongSerializer.get()));
    }

    @Override
    public Collection<String> findDeletedById(String statusId) {
        ColumnFamilyResult<String, String> result = deletedStatusTemplate.queryColumns(statusId);
        Collection<String> reportedStatuses = new ArrayList<String>();
        for (String columnName : result.getColumnNames()){
            reportedStatuses.add(columnName);
        }
        return reportedStatuses;
    }

    @Override
    public Collection<String> findAllDeleted() {
        //TODO: find all deleted statuses... Will be the same as statusReportRepository, find all reported statuses
        return  null;
    }

    @Override
    public boolean hasBeenDeleted(String statusId) {
        return false;
    }
}
