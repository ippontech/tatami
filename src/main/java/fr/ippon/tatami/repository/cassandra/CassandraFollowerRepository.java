package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.FollowerRepository;
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

import static fr.ippon.tatami.application.ColumnFamilyKeys.FOLLOWERS_CF;

/**
 * Cassandra implementation of the Follower repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraFollowerRepository implements FollowerRepository {

    private final Log log = LogFactory.getLog(CassandraFollowerRepository.class);

    ColumnFamilyTemplate<String, String> template;

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init() {
        template = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator,
                FOLLOWERS_CF,
                StringSerializer.get(),
                StringSerializer.get());
    }

    @Override
    public void addFollower(String login, String followerLogin) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, FOLLOWERS_CF, HFactory.createColumn(followerLogin,
                Calendar.getInstance().getTimeInMillis(), StringSerializer.get(), LongSerializer.get()));
    }

    @Override
    public void removeFollower(String login, String followerLogin) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(login, FOLLOWERS_CF, followerLogin, StringSerializer.get());
    }

    @Override
    public Collection<String> findFollowersForUser(String login) {
        ColumnFamilyResult<String, String> result = template.queryColumns(login);
        Collection<String> followers = new ArrayList<String>();
        for (String columnName : result.getColumnNames()) {
            followers.add(columnName);
        }
        return followers;
    }
}
