package fr.ippon.tatami.repository.cassandra;

import static com.google.common.collect.Lists.newArrayList;
import static fr.ippon.tatami.application.ColumnFamilyKeys.FOLLOWERS_CF;
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

import org.springframework.stereotype.Repository;

import fr.ippon.tatami.repository.FollowerRepository;

/**
 * Cassandra implementation of the Follower repository.
 * 
 * @author Julien Dubois
 */
@Repository
public class CassandraFollowerRepository implements FollowerRepository {

    ColumnFamilyTemplate<String, String> template;

    private static final StringSerializer stringSerializer = StringSerializer.get();
    private static final LongSerializer longSerializer = LongSerializer.get();

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init() {
        template = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator, FOLLOWERS_CF, stringSerializer, stringSerializer);
    }

    @Override
    public void addFollower(String login, String followerLogin) {
        createMutator(keyspaceOperator, stringSerializer) //
                .insert(login, FOLLOWERS_CF, //
                        createColumn(followerLogin, currentTimeMillis(), stringSerializer, longSerializer));
    }

    @Override
    public void removeFollower(String login, String followerLogin) {
        createMutator(keyspaceOperator, stringSerializer) //
                .delete(login, FOLLOWERS_CF, followerLogin, stringSerializer);
    }

    @Override
    public Collection<String> findFollowersForUser(String login) {
        List<String> followers = newArrayList();
        for (String columnName : template.queryColumns(login).getColumnNames()) {
            followers.add(columnName);
        }
        return followers;
    }
}
