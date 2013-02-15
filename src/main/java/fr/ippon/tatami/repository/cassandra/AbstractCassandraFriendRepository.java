package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * Abstract class for managing friends : users or tags that a user follows.
 */
public abstract class AbstractCassandraFriendRepository {

    private final Log log = LogFactory.getLog(AbstractCassandraFriendRepository.class);

    ColumnFamilyTemplate<String, String> friendsTemplate;

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init() {
        friendsTemplate = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator,
                getFriendsCF(),
                StringSerializer.get(),
                StringSerializer.get());

        friendsTemplate.setCount(Constants.CASSANDRA_MAX_COLUMNS);
    }

    protected void addFriend(String key, String friendKey) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(key, getFriendsCF(), HFactory.createColumn(friendKey,
                Calendar.getInstance().getTimeInMillis(), StringSerializer.get(), LongSerializer.get()));
    }

    protected void removeFriend(String key, String friendKey) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(key, getFriendsCF(), friendKey, StringSerializer.get());
    }

    protected List<String> findFriends(String key) {
        ColumnFamilyResult<String, String> result = friendsTemplate.queryColumns(key);
        List<String> friends = new ArrayList<String>();
        for (String columnName : result.getColumnNames()) {
            friends.add(columnName);
        }
        return friends;
    }

    protected abstract String getFriendsCF();
}
