package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.*;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.querybuilder.Select;
import fr.ippon.tatami.domain.status.Share;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.*;


/**
 * This abstract class contains commun functions for Timeline and Userline.
 * <p/>
 * Timeline and Userline have the same structure :
 * - Key : key
 * - Name : status Id
 * - Value : ""
 *
 * @author Julien Dubois
 */
public abstract class AbstractCassandraLineRepository {
    @Inject
    Session session;

    private final Logger log = LoggerFactory.getLogger(AbstractCassandraLineRepository.class);


    /**
     * Add a status to the CF.
     */
    protected void addStatus(String key, String table, String statusId) {
        Statement statement = QueryBuilder.insertInto(table)
                .value("key", key)
                .value("status", UUID.fromString(statusId));
        session.execute(statement);
    }

    /**
     * Add a status with a time-to-live.
     */
    protected void addStatus(String key, String table, String statusId, int ttl) {
        Statement statement = QueryBuilder.insertInto(table)
                .value("key", key)
                .value("status", UUID.fromString(statusId));
        session.execute(statement);
    }

    public abstract PreparedStatement getDeleteByIdStmt();

    /**
     * Remove a collection of statuses.
     */
    protected void removeStatuses(String key, String table, Collection<String> statusIdsToDelete) {
        BatchStatement batch = new BatchStatement();
        for (String statusId : statusIdsToDelete) {
            batch.add(getDeleteByIdStmt().bind()
                    .setString("key", key)
                    .setUUID("statusId", UUID.fromString(statusId)));
        }
        session.execute(batch);
    }

    List<String> getLineFromTable(String table, String key, int size, String start, String finish) {
        Select.Where where = QueryBuilder.select()
                .column("status")
                .from(table)
                .where(eq("key", key));
        if(finish != null) {
            where.and(lt("status", UUID.fromString(finish)));
        } else if(start != null) {
            where.and(gt("status",UUID.fromString(start)));
        }else if (size > 0) {
            where.limit(size);
        }
        where.orderBy(desc("status"));
        Statement statement = where;
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getUUID("status").toString())
                .collect(Collectors.toList());
    }

    void shareStatus(String login,
                     Share share,
                     String columnFamily,
                     String sharesColumnFamily) {

//        QueryResult<HColumn<UUID, String>> isStatusAlreadyinTimeline =
//                findByLoginAndStatusId(columnFamily, key, UUID.fromString(share.getOriginalStatusId()));
//
//        if (isStatusAlreadyinTimeline.get() == null) {
//            QueryResult<HColumn<UUID, String>> isStatusAlreadyShared =
//                    findByLoginAndStatusId(sharesColumnFamily, key, UUID.fromString(share.getOriginalStatusId()));
//
//            if (isStatusAlreadyShared.get() == null) {
//                Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//
//                mutator.insert(key, columnFamily, HFactory.createColumn(UUID.fromString(share.getStatusId()),
//                        "", UUIDSerializer.get(), StringSerializer.get()));
//
//                mutator.insert(key, sharesColumnFamily, HFactory.createColumn(UUID.fromString(share.getOriginalStatusId()),
//                        "", UUIDSerializer.get(), StringSerializer.get()));
//            } else {
//
//                log.debug("Shared status {} is already shared in {}", share.getOriginalStatusId(), columnFamily);
//
//            }
//        } else {
//
//            log.debug("Shared status {} is already present in {}", share.getOriginalStatusId(), columnFamily);
//
//        }
    }

//    QueryResult<String> findByLoginAndStatusId(String columnFamily, String key, UUID statusId) {
//        ColumnQuery<String, UUID, String> columnQuery =
//                HFactory.createColumnQuery(keyspaceOperator, StringSerializer.get(),
//                        UUIDSerializer.get(), StringSerializer.get());
//
//        columnQuery.setColumnFamily(columnFamily).setKey(key).setName(statusId);
//        return columnQuery.execute();
//        return null;
//    }
}
