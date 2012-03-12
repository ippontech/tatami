package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.FriendRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Calendar;

import static fr.ippon.tatami.application.ColumnFamilyKeys.FRIENDS_CF;

/**
 * Cassandra implementation of the Follower repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraFriendRepository implements FriendRepository {

    private final Log log = LogFactory.getLog(CassandraFriendRepository.class);

    @Inject
    private Keyspace keyspaceOperator;

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
}
