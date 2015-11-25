package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;

/**
 * Abstract class for managing followers : users who follow another user or a tag.
 */
public abstract class AbstractCassandraFollowerRepository {

//    private ColumnFamilyTemplate<String, String> template;


//    @PostConstruct
//    public void init() {
//        template = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator,
//                getFollowersCF(),
//                StringSerializer.get(),
//                StringSerializer.get());
//
//        template.setCount(Constants.CASSANDRA_MAX_COLUMNS);
//    }
//
//    void addFollower(String key, String followerKey) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.insert(key, getFollowersCF(), HFactory.createColumn(followerKey,
//                Calendar.getInstance().getTimeInMillis(), StringSerializer.get(), LongSerializer.get()));
//    }
//
//    void removeFollower(String key, String followerKey) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.delete(key, getFollowersCF(), followerKey, StringSerializer.get());
//    }
//
//    Collection<String> findFollowers(String key) {
//        ColumnFamilyResult<String, String> result = template.queryColumns(key);
//        Collection<String> followers = new ArrayList<String>();
//        for (String columnName : result.getColumnNames()) {
//            followers.add(columnName);
//        }
//        return followers;
//    }

    protected abstract String getFollowersCF();

    public void addFollower(String key, String login) {
    }

    public void removeFollower(String key, String login) {
    }

    public Collection<String> findFollowers(String key) {
        return new ArrayList<>();
    }
}
