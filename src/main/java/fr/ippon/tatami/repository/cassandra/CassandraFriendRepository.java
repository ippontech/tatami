package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.FriendRepository;
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
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;

import static fr.ippon.tatami.config.ColumnFamilyKeys.FOLLOWERS_CF;
import static fr.ippon.tatami.config.ColumnFamilyKeys.FRIENDS_CF;

/**
 * Cassandra implementation of the Follower repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraFriendRepository implements FriendRepository {

    private final Log log = LogFactory.getLog(CassandraFriendRepository.class);

    ColumnFamilyTemplate<String, String> friendsTemplate;

    ColumnFamilyTemplate<String, String> followersTemplate;

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init() {
        friendsTemplate = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator,
                FRIENDS_CF,
                StringSerializer.get(),
                StringSerializer.get());

        followersTemplate = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator,
                FOLLOWERS_CF,
                StringSerializer.get(),
                StringSerializer.get());
    }

    @Override
    public void addFriend(String login, String friendLogin) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, FRIENDS_CF, HFactory.createColumn(friendLogin,
                Calendar.getInstance().getTimeInMillis(), StringSerializer.get(), LongSerializer.get()));
    }

    @Override
    public void removeFriend(String login, String friendLogin) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(login, FRIENDS_CF, friendLogin, StringSerializer.get());
    }

    @Override
    public Collection<String> findFriendsForUser(String login) {
        ColumnFamilyResult<String, String> result = friendsTemplate.queryColumns(login);
        Collection<String> friends = new ArrayList<String>();
        for (String columnName : result.getColumnNames()) {
            friends.add(columnName);
        }
        return friends;
    }
}
