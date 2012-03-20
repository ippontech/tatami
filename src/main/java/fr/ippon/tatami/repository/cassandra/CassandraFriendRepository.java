package fr.ippon.tatami.repository.cassandra;

import static com.google.common.collect.Lists.newArrayList;
import static fr.ippon.tatami.application.ColumnFamilyKeys.FRIENDS_CF;
import static java.lang.System.currentTimeMillis;
import static me.prettyprint.hector.api.factory.HFactory.createColumn;
import static me.prettyprint.hector.api.factory.HFactory.createMutator;

import java.util.Collection;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;

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

    private static final StringSerializer stringSerializer = StringSerializer.get();
    private static final LongSerializer longSerializer = LongSerializer.get();

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init() {
        template = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator, FRIENDS_CF, stringSerializer, stringSerializer);
    }

    @Override
    public void addFriend(String login, String friendLogin) {
        HFactory.createMutator(keyspaceOperator, stringSerializer) //
                .insert(login, FRIENDS_CF, //
                        createColumn(friendLogin, currentTimeMillis(), stringSerializer, longSerializer));
    }

    @Override
    public void removeFriend(String login, String friendLogin) {
        createMutator(keyspaceOperator, stringSerializer) //
                .delete(login, FRIENDS_CF, friendLogin, stringSerializer);
    }

    @Override
    public Collection<String> findFriendsForUser(String login) {
        List<String> friends = newArrayList();
        for (String columnName : template.queryColumns(login).getColumnNames()) {
            friends.add(columnName);
        }
        return friends;
    }
}
