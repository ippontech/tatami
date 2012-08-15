package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.repository.StatusRepository;
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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.validation.*;
import java.util.*;

import static fr.ippon.tatami.config.ColumnFamilyKeys.TIMELINE_CF;
import static fr.ippon.tatami.config.ColumnFamilyKeys.USERLINE_CF;
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
public abstract class AbstractLineRepository {

    private final Log log = LogFactory.getLog(AbstractLineRepository.class);

    @Inject
    protected Keyspace keyspaceOperator;

    protected Map<String, String> getLineFromCF(String cf, String login, int size, String since_id, String max_id) {
        Map<String, String> line = new LinkedHashMap<String, String>();
        ColumnSlice<UUID, String> result;
        if (max_id != null) {
            result = createSliceQuery(keyspaceOperator,
                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                    .setColumnFamily(cf)
                    .setKey(login)
                    .setRange(UUID.fromString(max_id), null, true, size)
                    .execute()
                    .get();

            for (HColumn<UUID, String> column : result.getColumns().subList(1, result.getColumns().size())) {
                line.put(column.getName().toString(), column.getValue());
            }
        } else if (since_id != null) {
            result = createSliceQuery(keyspaceOperator,
                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                    .setColumnFamily(cf)
                    .setKey(login)
                    .setRange(null, UUID.fromString(since_id), true, size)
                    .execute()
                    .get();

            for (HColumn<UUID, String> column : result.getColumns().subList(0, result.getColumns().size() - 1)) {
                line.put(column.getName().toString(), column.getValue());
            }
        } else {
            result = createSliceQuery(keyspaceOperator,
                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                    .setColumnFamily(cf)
                    .setKey(login)
                    .setRange(null, null, true, size)
                    .execute()
                    .get();

            for (HColumn<UUID, String> column : result.getColumns()) {
                line.put(column.getName().toString(), column.getValue());
            }
        }
        return line;
    }

    protected void shareStatus(String login, Status status, String sharedByLogin, String columnFamily) {
        UUID name = UUID.fromString(status.getStatusId());
        ColumnQuery<String, UUID, String> columnQuery =
                HFactory.createColumnQuery(keyspaceOperator, StringSerializer.get(),
                        UUIDSerializer.get(), StringSerializer.get());

        columnQuery.setColumnFamily(columnFamily).setKey(login).setName(name);
        QueryResult<HColumn<UUID, String>> result = columnQuery.execute();
        if (result.get() == null) {
            Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
            mutator.insert(login, columnFamily, HFactory.createColumn(UUID.fromString(status.getStatusId()),
                    sharedByLogin, UUIDSerializer.get(), StringSerializer.get()));
        } else {
            if (log.isDebugEnabled()) {
                log.debug("Shared status " + status.getStatusId() + " is already in " + columnFamily);
            }
        }
    }
}
