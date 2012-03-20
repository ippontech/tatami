package fr.ippon.tatami.repository.cassandra;

import static fr.ippon.tatami.application.ColumnFamilyKeys.FRIENDS_CF;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;

import org.springframework.stereotype.Repository;

import fr.ippon.tatami.repository.FriendRepository;

/**
 * Cassandra implementation of the Follower repository.
 * 
 * @author Julien Dubois
 */
@Repository
public class CassandraFriendRepository implements FriendRepository {

    ColumnFamilyTemplate<String, String> template;

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init() {
        template = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator, FRIENDS_CF, StringSerializer.get(), StringSerializer.get());
    }

    @Override
    public void addFriend(String login, String friendLogin) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, FRIENDS_CF,
                HFactory.createColumn(friendLogin, Calendar.getInstance().getTimeInMillis(), StringSerializer.get(), LongSerializer.get()));
    }

    @Override
    public void removeFriend(String login, String friendLogin) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(login, FRIENDS_CF, friendLogin, StringSerializer.get());
    }

    @Override
    public Collection<String> findFriendsForUser(String login) {
        ColumnFamilyResult<String, String> result = template.queryColumns(login);
        Collection<String> friends = new ArrayList<String>();
        for (String columnName : result.getColumnNames()) {
            friends.add(columnName);
        }
        return friends;
    }
}
