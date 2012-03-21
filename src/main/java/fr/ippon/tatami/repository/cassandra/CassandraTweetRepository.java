package fr.ippon.tatami.repository.cassandra;

import static fr.ippon.tatami.application.ColumnFamilyKeys.DAYLINE_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.TIMELINE_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.USERLINE_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.ColumnSliceIterator;
import me.prettyprint.cassandra.utils.TimeUUIDUtils;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.SliceQuery;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.repository.TweetRepository;

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
    public Tweet createTweet(String login, String content) {
        Tweet tweet = new Tweet();
        tweet.setTweetId(TimeUUIDUtils.getUniqueTimeUUIDinMillis().toString());
        tweet.setLogin(login);
        tweet.setContent(content);
        tweet.setTweetDate(Calendar.getInstance().getTime());
        if (log.isDebugEnabled()) {
            log.debug("Persisting Tweet : " + tweet);
        }
        em.persist(tweet);
        return tweet;
    }

    @Override
    public void addTweetToDayline(Tweet tweet, String key) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(key, DAYLINE_CF, HFactory.createColumn(tweet.getLogin(), tweet.getTweetId(),
        		StringSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void addTweetToUserline(Tweet tweet) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(tweet.getLogin(), USERLINE_CF, HFactory.createColumn(Calendar.getInstance().getTimeInMillis(),
                tweet.getTweetId(), LongSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void addTweetToTimeline(String login, Tweet tweet) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, TIMELINE_CF, HFactory.createColumn(Calendar.getInstance().getTimeInMillis(),
                tweet.getTweetId(), LongSerializer.get(), StringSerializer.get()));
    }

    @Override
    public Collection<String> getDayline(String date) {
        SliceQuery<String, String, String> sq = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(DAYLINE_CF)
                .setKey(date)
                .setRange(null, null, false, 100);

        Collection<String> tweetIds = new ArrayList<String>();
        ColumnSliceIterator<String, String, String> csi =
        		new ColumnSliceIterator<String, String, String>(sq, null, "", false);
        while (csi.hasNext()) {
            tweetIds.add(csi.next().getValue());
        }
        return tweetIds;
    }

    @Override
    public Collection<String> getTimeline(String login, int size) {
        ColumnSlice<String, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(TIMELINE_CF)
                .setKey(login)
                .setRange(null, null, true, size)
                .execute()
                .get();

        Collection<String> tweetIds = new ArrayList<String>();
        for (HColumn<String, String> column : result.getColumns()) {
            tweetIds.add(column.getValue());
        }
        return tweetIds;
    }

    @Override
    public Collection<String> getUserline(String login, int size) {
        ColumnSlice<String, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(USERLINE_CF)
                .setKey(login)
                .setRange(null, null, true, size)
                .execute()
                .get();

        Collection<String> tweetIds = new ArrayList<String>();
        for (HColumn<String, String> column : result.getColumns()) {
            tweetIds.add(column.getValue());
        }
        return tweetIds;
    }

    @Override
    @Cacheable("tweet-cache")
    public Tweet findTweetById(String tweetId) {
        if (log.isDebugEnabled()) {
            log.debug("Finding tweet : " + tweetId);
        }
        return em.find(Tweet.class, tweetId);
    }
}
