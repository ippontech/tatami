package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.*;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.querybuilder.Select;
import com.datastax.driver.core.querybuilder.Select.Where;
import com.datastax.driver.mapping.Mapper;
import com.datastax.driver.mapping.MappingManager;
import fr.ippon.tatami.domain.status.Announcement;
import fr.ippon.tatami.domain.status.Share;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.repository.TimelineRepository;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static com.datastax.driver.core.querybuilder.QueryBuilder.gt;
import static com.datastax.driver.core.querybuilder.QueryBuilder.lt;
import static fr.ippon.tatami.config.ColumnFamilyKeys.TIMELINE_CF;
import static fr.ippon.tatami.config.ColumnFamilyKeys.TIMELINE_SHARES_CF;

/**
 * Cassandra implementation of the Timeline repository.
 * <p/>
 * Structure :
 * - Key : login
 * - Name : status Id
 * - Value : ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraTimelineRepository extends AbstractCassandraLineRepository implements TimelineRepository {

    @Inject
    Session session;

    private Mapper<Status> mapper;

    private PreparedStatement findByLoginStmt;

    @PostConstruct
    public void init() {
        mapper = new MappingManager(session).mapper(Status.class);
        findByLoginStmt = session.prepare(
                "SELECT * " +
                        "FROM timeline " +
                        "WHERE login = :login");
    }


    @Override
    public boolean isStatusInTimeline(String login, String statusId) {
//        QueryResult<HColumn<UUID, String>> isStatusAlreadyinTimeline =
//                findByLoginAndStatusId(TIMELINE_CF, login, UUID.fromString(statusId));
//
//        return isStatusAlreadyinTimeline.get() != null;
        return false;
    }

    @Override
    public void addStatusToTimeline(String login, String statusId) {
        addStatus(login, TIMELINE_CF, statusId);
    }

    @Override
    public void removeStatusesFromTimeline(String login, Collection<String> statusIdsToDelete) {
        removeStatuses(login, TIMELINE_CF, statusIdsToDelete);
    }

    @Override
    public void shareStatusToTimeline(String sharedByLogin, String timelineLogin, Share share) {
        shareStatus(timelineLogin, share, TIMELINE_CF, TIMELINE_SHARES_CF);
    }

    @Override
    public void announceStatusToTimeline(String announcedByLogin, List<String> logins, Announcement announcement) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//
//        for (String login : logins) {
//            mutator.addInsertion(login, TIMELINE_CF, HFactory.createColumn(UUID.fromString(announcement.getStatusId()),
//                    "", UUIDSerializer.get(), StringSerializer.get()));
//        }
//        mutator.execute();
    }

    @Override
    public List<String> getTimeline(String login, int size, String start, String finish) {

        Where where = QueryBuilder.select()
                .column("status")
                .from("timeline")
                .where(eq("login", login));
        if(finish != null) {
            where.and(lt("status",UUID.fromString(finish)));
        } else if(start != null) {
            where.and(gt("status",UUID.fromString(start)));
        }
        Statement statement = where;
        if (size > 0) {
            statement.setFetchSize(size);
        }
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getUUID("status").toString())
                .collect(Collectors.toList());
//        for ( Row row : results ) {
//            System.out.println("Song: " + row.getString("artist"));
//        }
//        return getLineFromCF(TIMELINE_CF, login, size, start, finish);
        //        if (finish != null) {
//            ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
//                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
//                    .setColumnFamily(cf)
//                    .setKey(login)
//                    .setRange(UUID.fromString(finish), null, true, size)
//                    .execute()
//                    .get();
//
//            result = query.getColumns().subList(1, query.getColumns().size());
//        } else if (start != null) {
//            ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
//                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
//                    .setColumnFamily(cf)
//                    .setKey(login)
//                    .setRange(null, UUID.fromString(start), true, size)
//                    .execute()
//                    .get();
//
//            int maxIndex = query.getColumns().size() - 1;
//            if (maxIndex < 0) {
//                maxIndex = 0;
//            }
//            result = query.getColumns().subList(0, maxIndex);
//        } else {
//            ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
//                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
//                    .setColumnFamily(cf)
//                    .setKey(login)
//                    .setRange(null, null, true, size)
//                    .execute()
//                    .get();
//
//            result = query.getColumns();
//        }

    }

    @Override
    public void deleteTimeline(String login) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.addDeletion(login, TIMELINE_CF);
//        mutator.execute();
    }
}
