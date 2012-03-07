package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.FollowerRepository;
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

import static fr.ippon.tatami.application.ColumnFamilyKeys.FOLLOWERS_CF;

/**
 * Cassandra implementation of the Follower repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraFollowerRepository implements FollowerRepository {

    private final Log log = LogFactory.getLog(CassandraFollowerRepository.class);

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void addFollower(String login, String followerLogin) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, FOLLOWERS_CF, HFactory.createColumn(followerLogin,
                Calendar.getInstance().getTimeInMillis(), StringSerializer.get(), LongSerializer.get()));
    }

    @Override
    public int getFollowersCount(String login) {
        return 0;  //To change body of implemented methods use File | Settings | File Templates.
    }
}
