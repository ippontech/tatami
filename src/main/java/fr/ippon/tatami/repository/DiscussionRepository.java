package fr.ippon.tatami.repository;

import com.datastax.driver.core.*;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.mapping.Mapper;
import com.datastax.driver.mapping.MappingManager;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.repository.DiscussionRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.text.NumberFormat;
import java.util.*;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.desc;
import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;

/**
 * Cassandra implementation of the StatusDetails repository.
 * <p/>
 * Structure :
 * - Key = originial status Id
 * - Name = time
 * - Value = reply status Id
 *
 * @author Julien Dubois
 */
@Repository
public class DiscussionRepository {

    @Inject
    Session session;

    private Mapper<Status> mapper;

    private PreparedStatement findStatusIdsInDiscussionStmt;

    private PreparedStatement insertByStatusId;

    @PostConstruct
    public void init() {
        mapper = new MappingManager(session).mapper(Status.class);

        findStatusIdsInDiscussionStmt = session.prepare(
            "SELECT statusId " +
                "FROM discussion " +
                "WHERE discussionId = :originalStatusId " +
                "ORDER BY statusId ASC");

        insertByStatusId = session.prepare(
            "INSERT INTO discussion (statusId, discussionId) " +
                "VALUES (:statusId, :discussionId)");
    }

    public Collection<String> findStatusIdsInDiscussion(String originalStatusId) {
        BoundStatement stmt = findStatusIdsInDiscussionStmt.bind();
        stmt.setString("originalStatusId", originalStatusId);
        ResultSet resultSet = session.execute(stmt);
        Collection<String> statusIdsInDiscussion = new ArrayList<>();
        String rowValueToBeAdded = null;
        while (!resultSet.isExhausted()) {
            String unedittedRowValue = resultSet.one().toString();
            if (unedittedRowValue.contains("Row")){
//                This trims unusable text from the row value:
                rowValueToBeAdded = unedittedRowValue.substring(4, unedittedRowValue.length() - 1);
            } else {
                rowValueToBeAdded = unedittedRowValue;
            }
            statusIdsInDiscussion.add(rowValueToBeAdded);
        }
        return statusIdsInDiscussion;
    }

    @CacheEvict(value = "status-cache", key = "#originalStatusId")
    public void addReplyToDiscussion(String discussionId, String statusId) {
        BoundStatement stmt = insertByStatusId.bind();
        stmt.setUUID("statusId", UUID.fromString(statusId));
        stmt.setString("discussionId", discussionId);
        session.execute(stmt);
    }


//    public Collection<String> findStatusIdsInDiscussion(String originalStatusId) {
////        ColumnSlice<Long, String> result = createSliceQuery(keyspaceOperator,
////                StringSerializer.get(), LongSerializer.get(), StringSerializer.get())
////                .setColumnFamily(DISCUSSION_CF)
////                .setKey(originalStatusId)
////                .setRange(null, null, false, Integer.MAX_VALUE)
////                .execute()
////                .get();
////
////        Collection<String> statusIds = new LinkedHashSet<String>();
////        for (HColumn<Long, String> column : result.getColumns()) {
////            statusIds.add(column.getValue());
////        }
////        return statusIds;
//
//
//        Statement statement = QueryBuilder.select()
//            .column("discussionId")
//            .from("status")
//            .where(eq("statusId", originalStatusId))
//            .orderBy(desc("statusDate"));
////            .limit(50);
//        ResultSet results = session.execute(statement);
//
//        Collection<String> resultCollection = new ArrayList<>();
//        while(results.one() != null) {
//            resultCollection.add(results.one().toString());
//        }
//
//        return resultCollection;
////        return results
////            .all()
////            .stream()
////            .map(e -> e.getDate("statusId").toString())
////            .collect(Collectors.toList());
//    }


    public boolean hasReply(String statusId) {
//        int zeroOrOne = HFactory.createCountQuery(keyspaceOperator, StringSerializer.get(), LongSerializer.get())
//                .setColumnFamily(DISCUSSION_CF)
//                .setKey(statusId)
//                .setRange(null, null, 1)
//                .execute()
//                .get();

        return 1 > 0;
    }
}
