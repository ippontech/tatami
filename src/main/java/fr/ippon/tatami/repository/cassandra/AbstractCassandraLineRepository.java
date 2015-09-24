package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.status.Share;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.ColumnQuery;
import me.prettyprint.hector.api.query.QueryResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
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

    private final Logger log = LoggerFactory.getLogger(AbstractCassandraLineRepository.class);

    @Inject
    protected Keyspace keyspaceOperator;

    /**
     * Add a status to the CF.
     */
    protected void addStatus(String key, String cf, String statusId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(key, cf, HFactory.createColumn(UUID.fromString(statusId),
                "", UUIDSerializer.get(), StringSerializer.get()));
    }

    /**
     * Add a status with a time-to-live.
     */
    protected void addStatus(String key, String cf, String statusId, int ttl) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(key, cf, HFactory.createColumn(UUID.fromString(statusId),
                "", ttl, UUIDSerializer.get(), StringSerializer.get()));
    }

    /**
     * Remove a collection of statuses.
     */
    protected void removeStatuses(String key, String cf, Collection<String> statusIdsToDelete) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        for (String statusId : statusIdsToDelete) {
            mutator.addDeletion(key, cf, UUID.fromString(statusId), UUIDSerializer.get());
        }
        mutator.execute();
    }

    List<String> getLineFromCF(String cf, String login, int size, String start, String finish) {
        List<HColumn<UUID, String>> result;
        if (finish != null) {
            ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                    .setColumnFamily(cf)
                    .setKey(login)
                    .setRange(UUID.fromString(finish), null, true, size)
                    .execute()
                    .get();

            result = query.getColumns().subList(1, query.getColumns().size());
        } else if (start != null) {
            ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                    .setColumnFamily(cf)
                    .setKey(login)
                    .setRange(null, UUID.fromString(start), true, size)
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

        List<String> line = new ArrayList<String>();
        for (HColumn<UUID, String> column : result) {
            line.add(column.getName().toString());
        }
        return line;
    }

    void shareStatus(String login,
                     Share share,
                     String columnFamily,
                     String sharesColumnFamily) {

        QueryResult<HColumn<UUID, String>> isStatusAlreadyinTimeline =
                findByLoginAndStatusId(columnFamily, login, UUID.fromString(share.getOriginalStatusId()));

        if (isStatusAlreadyinTimeline.get() == null) {
            QueryResult<HColumn<UUID, String>> isStatusAlreadyShared =
                    findByLoginAndStatusId(sharesColumnFamily, login, UUID.fromString(share.getOriginalStatusId()));

            if (isStatusAlreadyShared.get() == null) {
                Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());

                mutator.insert(login, columnFamily, HFactory.createColumn(UUID.fromString(share.getStatusId()),
                        "", UUIDSerializer.get(), StringSerializer.get()));

                mutator.insert(login, sharesColumnFamily, HFactory.createColumn(UUID.fromString(share.getOriginalStatusId()),
                        "", UUIDSerializer.get(), StringSerializer.get()));
            } else {

                log.debug("Shared status {} is already shared in {}", share.getOriginalStatusId(), columnFamily);

            }
        } else {

            log.debug("Shared status {} is already present in {}", share.getOriginalStatusId(), columnFamily);

        }
    }

    QueryResult<HColumn<UUID, String>> findByLoginAndStatusId(String columnFamily, String login, UUID statusId) {
        ColumnQuery<String, UUID, String> columnQuery =
                HFactory.createColumnQuery(keyspaceOperator, StringSerializer.get(),
                        UUIDSerializer.get(), StringSerializer.get());

        columnQuery.setColumnFamily(columnFamily).setKey(login).setName(statusId);
        return columnQuery.execute();
    }
}
