package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.List;

/**
 * Abstract class for managing friends : users or tags that a user follows.
 */
public abstract class AbstractCassandraFriendRepository {

//    private ColumnFamilyTemplate<String, String> friendsTemplate;


//    @PostConstruct
//    public void init() {
//        friendsTemplate = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator,
//                getFriendsCF(),
//                StringSerializer.get(),
//                StringSerializer.get());
//
//        friendsTemplate.setCount(Constants.CASSANDRA_MAX_COLUMNS);
//    }
//
//    void addFriend(String key, String friendKey) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.insert(key, getFriendsCF(), HFactory.createColumn(friendKey,
//                Calendar.getInstance().getTimeInMillis(), StringSerializer.get(), LongSerializer.get()));
//    }
//
//    void removeFriend(String key, String friendKey) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.delete(key, getFriendsCF(), friendKey, StringSerializer.get());
//    }
//
//    List<String> findFriends(String key) {
//        ColumnFamilyResult<String, String> result = friendsTemplate.queryColumns(key);
//        List<String> friends = new ArrayList<String>();
//        for (String columnName : result.getColumnNames()) {
//            friends.add(columnName);
//        }
//        return friends;
//    }

    protected abstract String getFriendsCF();

    public void addFriend(String login, String friendTag) {

    }

    public void removeFriend(String login, String friendTag) {
    }

    public Collection<String> findFriends(String login) {
        return null;
    }
}
