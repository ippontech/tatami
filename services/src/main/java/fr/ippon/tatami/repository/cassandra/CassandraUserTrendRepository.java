package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.UserTrendRepository;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.inject.Inject;
import java.util.*;


/**
 * Cassandra implementation of the User Trends repository.
 * <p/>
 * Structure :
 * - Key = login
 * - Name = date
 * - Value = tag
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraUserTrendRepository implements UserTrendRepository {

    private final static int COLUMN_TTL = 60 * 60 * 24 * 90; // The column is stored for 90 days.

    private final static int TRENDS_NUMBER_OF_TAGS = 50;

//    @Inject
//    private Keyspace keyspaceOperator;

    @Override
    public void addTag(String login, String tag) {
//        HColumn<UUID, String> column =
//                HFactory.createColumn(
//                        TimeUUIDUtils.getUniqueTimeUUIDinMillis(),
//                        tag,
//                        COLUMN_TTL,
//                        UUIDSerializer.get(),
//                        StringSerializer.get());
//
//        Mutator<String> mutator =
//                HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//
//        mutator.insert(login, ColumnFamilyKeys.USER_TRENDS_CF, column);
    }

    @Override
    public List<String> getRecentTags(String login) {
//        ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
//                StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
//                .setColumnFamily(ColumnFamilyKeys.USER_TRENDS_CF)
//                .setKey(login)
//                .setRange(null, null, true, TRENDS_NUMBER_OF_TAGS)
//                .execute()
//                .get();
//
//        List<String> result = new ArrayList<String>();
//        for (HColumn<UUID, String> column : query.getColumns()) {
//            String tag = column.getValue();
//            result.add(tag);
//        }
//        return result;
        return null;
    }

    @Override
    public Collection<String> getUserRecentTags(String login, Date endDate,
                                                int nbRecentTags) {
//        ColumnSlice<UUID, String> query = createSliceQuery(keyspaceOperator,
//                StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
//                .setColumnFamily(ColumnFamilyKeys.USER_TRENDS_CF)
//                .setKey(login)
//                .setRange(null, TimeUUIDUtils.getTimeUUID(endDate.getTime()), true, nbRecentTags)
//                .execute()
//                .get();
//        Map<String, String> result = new HashMap<String, String>();
//        String tag;
//        for (HColumn<UUID, String> column : query.getColumns()) {
//            tag = column.getValue();
//            result.put(tag.toLowerCase(), tag);
//        }
//        return result.values();
        return null;
    }
}
