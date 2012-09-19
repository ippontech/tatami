package fr.ippon.tatami.repository.cassandra;

import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;

/**
 * Abstract class for managing friends : users or tags that a user follows.
 */
public abstract class AbstractCassandraFriendRepository {

    ColumnFamilyTemplate<String, String> friendsTemplate;

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init() {
        friendsTemplate = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator,
                getFriendsCF(),
                StringSerializer.get(),
                StringSerializer.get());
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

    protected Collection<String> findFriends(String key) {
        ColumnFamilyResult<String, String> result = friendsTemplate.queryColumns(key);
        Collection<String> friends = new ArrayList<String>();
        for (String columnName : result.getColumnNames()) {
            friends.add(columnName);
        }
        return friends;
    }

    protected abstract String getFriendsCF();
}
