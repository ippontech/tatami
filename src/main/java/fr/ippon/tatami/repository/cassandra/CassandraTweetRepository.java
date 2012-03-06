package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.repository.TweetRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.ColumnQuery;
import me.prettyprint.hector.api.query.QueryResult;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import java.util.Calendar;

import static fr.ippon.tatami.application.ColumnFamilyKeys.*;

/**
 * Cassandra implementation of the user repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraTweetRepository implements TweetRepository {

    private final Log log = LogFactory.getLog(CassandraTweetRepository.class);

    @Inject
    private EntityManager em;

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public Tweet createTweet(String email, String content) {
        Tweet tweet = new Tweet();
        tweet.setEmail(email);
        tweet.setContent(content);
        em.persist(tweet);
        return tweet;
    }

    @Override
    public void addTweetToUserline(Tweet tweet) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(tweet.getEmail(), USERLINE_CF, HFactory.createColumn(Calendar.getInstance().getTimeInMillis(),
                tweet.getTweetId(), LongSerializer.get(), StringSerializer.get()));
    }
}
