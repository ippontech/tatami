package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.repository.TweetRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.utils.TimeUUIDUtils;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
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

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.List;

import static com.google.common.collect.Lists.newArrayList;
import static fr.ippon.tatami.application.ColumnFamilyKeys.*;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

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
        tweet.setTweetId(TimeUUIDUtils.getUniqueTimeUUIDinMillis().toString());
        tweet.setEmail(email);
        tweet.setContent(content);
        if (log.isDebugEnabled()) {
            log.debug("Persisting Tweet : " + tweet);
        }
        em.persist(tweet);
        return tweet;
    }

    @Override
    public void addTweetToUserline(Tweet tweet) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(tweet.getEmail(), USERLINE_CF, HFactory.createColumn(Calendar.getInstance().getTimeInMillis(),
                tweet.getTweetId(), LongSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void addTweetToTimeline(String email, Tweet tweet) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(email, USERLINE_CF, HFactory.createColumn(Calendar.getInstance().getTimeInMillis(),
                tweet.getTweetId(), LongSerializer.get(), StringSerializer.get()));
    }

    @Override
    public Collection<String> getTimeline(String email) {
        ColumnSlice<String, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(USERLINE_CF)
                .setKey(email)
                .setRange(null, null, false, 50)
                .execute()
                .get();

        List<String> tweetIds = new ArrayList<String>();
        for (HColumn<String, String> column : result.getColumns()) {
            tweetIds.add(column.getValue());
        }
        return tweetIds;
    }

    @Override
    public Tweet findTweetById(String tweetId) {
        if (log.isDebugEnabled()) {
            log.debug("Finding tweet : " + tweetId);
        }
        return em.find(Tweet.class, tweetId);
    }
}
