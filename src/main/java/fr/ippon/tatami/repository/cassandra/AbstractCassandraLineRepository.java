package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.cassandra.utils.TimeUUIDUtils;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.ColumnQuery;
import me.prettyprint.hector.api.query.QueryResult;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.inject.Inject;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

/**
 * This abstract class contains commun functions for Timeline and Userline.
 * <p/>
 * Timeline and Userline have the same structure :
 * - Key : login
 * - Name : status Id
 * - Value : ""
 *
 * @author Julien Dubois
 */
public abstract class AbstractCassandraLineRepository {

    private final Log log = LogFactory.getLog(AbstractCassandraLineRepository.class);

    @Inject
    protected Keyspace keyspaceOperator;

    protected Map<String, SharedStatusInfo> getLineFromCF(String cf, String login, int size, String since_id, String max_id) {
        List<HColumn<UUID, String>> result;
        if (max_id != null) {
            ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                    .setColumnFamily(cf)
                    .setKey(login)
                    .setRange(UUID.fromString(max_id), null, true, size)
                    .execute()
                    .get();

            result = query.getColumns().subList(1, query.getColumns().size());
        } else if (since_id != null) {
            ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                    .setColumnFamily(cf)
                    .setKey(login)
                    .setRange(null, UUID.fromString(since_id), true, size)
                    .execute()
                    .get();

            int maxIndex = query.getColumns().size() - 1;
            if (maxIndex < 0) {
                maxIndex = 0;
            }
            result = query.getColumns().subList(0, maxIndex);
        } else {
            ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                    .setColumnFamily(cf)
                    .setKey(login)
                    .setRange(null, null, true, size)
                    .execute()
                    .get();

            result = query.getColumns();
        }

        Map<String, SharedStatusInfo> line = new LinkedHashMap<String, SharedStatusInfo>();
        boolean logDebug = log.isDebugEnabled();
        for (HColumn<UUID, String> column : result) {
            String value = column.getValue();
            if (value.equals("")) { // This is a normal status
                line.put(column.getName().toString(), null);
            } else { // This status was shared by another user
                // The form is statusId:'statusId',sharedByLogin:'sharedByLogin'
                // So we just substing() to get the original status Id and who shared it
                String orginialStatusId = value.substring(9, 45);
                String sharedByLogin = value.substring(60, value.length());
                if (logDebug) {
                    log.debug("Shared status : " + orginialStatusId + " shared by : " + sharedByLogin);
                }
                SharedStatusInfo sharedStatusInfo = new SharedStatusInfo(
                        column.getName().toString(),
                        orginialStatusId,
                        sharedByLogin);

                line.put(orginialStatusId, sharedStatusInfo);
            }
        }
        return line;
    }

    protected void shareStatus(String login,
                               Status status,
                               String sharedByLogin,
                               String columnFamily,
                               String sharesColumnFamily) {

        UUID name = UUID.fromString(status.getStatusId());
        QueryResult<HColumn<UUID, String>> isStatusAlreadyinTimeline =
                findByLoginAndName(columnFamily, login, name);

        if (isStatusAlreadyinTimeline.get() == null) {
            QueryResult<HColumn<UUID, String>> isStatusAlreadyShared =
                    findByLoginAndName(sharesColumnFamily, login, name);

            if (isStatusAlreadyShared.get() == null) {
                UUID shareId = TimeUUIDUtils.getUniqueTimeUUIDinMillis();
                Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());

                mutator.insert(login, columnFamily, HFactory.createColumn(shareId,
                        "statusId:" + status.getStatusId() + ",sharedByLogin:" + sharedByLogin, UUIDSerializer.get(), StringSerializer.get()));

                mutator.insert(login, sharesColumnFamily, HFactory.createColumn(UUID.fromString(status.getStatusId()),
                        "", UUIDSerializer.get(), StringSerializer.get()));
            } else {
                if (log.isDebugEnabled()) {
                    log.debug("Shared status " + status.getStatusId() + " is already shared in " + columnFamily);
                }
            }
        } else {
            if (log.isDebugEnabled()) {
                log.debug("Shared status " + status.getStatusId() + " is already present in " + columnFamily);
            }
        }
    }

    protected QueryResult<HColumn<UUID, String>> findByLoginAndName(String columnFamily, String login, UUID name) {
        ColumnQuery<String, UUID, String> columnQuery =
                HFactory.createColumnQuery(keyspaceOperator, StringSerializer.get(),
                        UUIDSerializer.get(), StringSerializer.get());

        columnQuery.setColumnFamily(columnFamily).setKey(login).setName(name);
        return columnQuery.execute();
    }
}
