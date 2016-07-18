package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.status.AbstractStatus;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.domain.status.StatusType;
import fr.ippon.tatami.repository.DeletedHoldingRepository;
import fr.ippon.tatami.repository.StatusRepository;
import fr.ippon.tatami.service.util.DomainUtil;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ColumnFamilyUpdater;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.OrderedRows;
import me.prettyprint.hector.api.beans.Row;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.RangeSlicesQuery;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.*;

import static fr.ippon.tatami.config.ColumnFamilyKeys.DELETED_STATUSES_CF;

/**
 * Created by emilyklein on 7/13/16.
 */
public class CassandraDeletedHoldingRepository implements DeletedHoldingRepository{

    //Normal status
    private static final String STATUS_PRIVATE = "statusPrivate";
    private static final String GROUP_ID = "groupId";
    private static final String HAS_ATTACHMENTS = "hasAttachments";
    private static final String CONTENT = "content";
    private static final String DISCUSSION_ID = "discussionId";
    private static final String REPLY_TO = "replyTo";
    private static final String REPLY_TO_USERNAME = "replyToUsername";
    private static final String GEO_LOCALIZATION = "geoLocalization";

    private ColumnFamilyTemplate<String, String> deletedStatusTemplate;

    @Inject
    private Keyspace keyspaceOperator;

    @Inject
    StatusRepository statusRepository;

    @PostConstruct
    public void init() {
        deletedStatusTemplate = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator,
                DELETED_STATUSES_CF,
                StringSerializer.get(),
                StringSerializer.get());
    }

    @Override
    public void addDeletedStatus(String reportedStatusId, String adminResolved) {
        AbstractStatus deletedStatus = statusRepository.findStatusById(reportedStatusId);

        Status deleted = (Status) deletedStatus;

        if (deleted != null){

            ColumnFamilyUpdater<String, String> updater = deletedStatusTemplate.createUpdater(reportedStatusId);;

            updater.setString(CONTENT, deleted.getContent());

            updater.setBoolean(STATUS_PRIVATE, deleted.getStatusPrivate());
            updater.setString(GROUP_ID, deleted.getGroupId());
            updater.setBoolean(HAS_ATTACHMENTS, deleted.getHasAttachments());
            updater.setString(DISCUSSION_ID, deleted.getDiscussionId());
            updater.setString(REPLY_TO, deleted.getReplyTo());
            updater.setString(REPLY_TO_USERNAME, deleted.getReplyToUsername());
            updater.setString(GEO_LOCALIZATION, deleted.getGeoLocalization());
        }

    }

    @Override
    public Collection<String> findAllDeleted() {
        List<String> deletedStatuses = new ArrayList<String>();
        RangeSlicesQuery<String, String, String> findAll = HFactory
                .createRangeSlicesQuery(keyspaceOperator, StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(DELETED_STATUSES_CF)
                .setRange(null, null, false, 10)
                .setRowCount(10);
        OrderedRows<String, String, String> result = findAll.execute().get();
        for (Row<String, String, String> row : result.getList()) {
            deletedStatuses.add(row.getKey());
        }
        return deletedStatuses;
    }

}
