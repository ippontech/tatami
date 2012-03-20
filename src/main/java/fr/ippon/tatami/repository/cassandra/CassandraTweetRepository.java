package fr.ippon.tatami.repository.cassandra;

import static com.google.common.collect.Lists.newArrayList;
import static fr.ippon.tatami.application.ColumnFamilyKeys.TIMELINE_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.USERLINE_CF;
import static fr.ippon.tatami.domain.Tweet.tweet;
import static java.lang.System.currentTimeMillis;
import static me.prettyprint.cassandra.utils.TimeUUIDUtils.getUniqueTimeUUIDinMillis;
import static me.prettyprint.hector.api.factory.HFactory.createColumn;
import static me.prettyprint.hector.api.factory.HFactory.createMutator;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

import java.util.Calendar;
import java.util.Collection;
import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import lombok.extern.slf4j.Slf4j;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;

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
@Slf4j
public class CassandraTweetRepository implements TweetRepository {

    private static final StringSerializer stringSerializer = StringSerializer.get();
    private static final LongSerializer longSerializer = LongSerializer.get();

    @Inject
    private EntityManager em;

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public Tweet createTweet(String login, String content) {
        Tweet tweet = tweet() //
                .tweetId(getUniqueTimeUUIDinMillis().toString()) //
                .login(login) //
                .content(content) //
                .tweetDate(Calendar.getInstance().getTime()) //
                .build();
        log.debug("Persisting Tweet : {}", tweet);
        em.persist(tweet);
        return tweet;
    }

    @Override
    public void addTweetToUserline(Tweet tweet) {
        createMutator(keyspaceOperator, stringSerializer) //
                .insert(tweet.getLogin(), USERLINE_CF, //
                        createColumn(currentTimeMillis(), tweet.getTweetId(), longSerializer, stringSerializer));
    }

    @Override
    public void addTweetToTimeline(String login, Tweet tweet) {
        createMutator(keyspaceOperator, stringSerializer) //
                .insert(login, TIMELINE_CF, //
                        createColumn(currentTimeMillis(), tweet.getTweetId(), longSerializer, stringSerializer));
    }

    @Override
    public Collection<String> getTimeline(String login, int size) {
        ColumnSlice<String, String> result = createSliceQuery(keyspaceOperator, stringSerializer, stringSerializer, stringSerializer) //
                .setColumnFamily(TIMELINE_CF) //
                .setKey(login) //
                .setRange(null, null, true, size) //
                .execute() //
                .get();

        List<String> tweetIds = newArrayList();
        for (HColumn<String, String> column : result.getColumns()) {
            tweetIds.add(column.getValue());
        }
        return tweetIds;
    }

    @Override
    public Collection<String> getUserline(String login, int size) {
        ColumnSlice<String, String> result = createSliceQuery(keyspaceOperator, stringSerializer, stringSerializer, stringSerializer) //
                .setColumnFamily(USERLINE_CF) //
                .setKey(login) //
                .setRange(null, null, true, size) //
                .execute() //
                .get();

        List<String> tweetIds = newArrayList();
        for (HColumn<String, String> column : result.getColumns()) {
            tweetIds.add(column.getValue());
        }
        return tweetIds;
    }

    @Override
    @Cacheable("tweet-cache")
    public Tweet findTweetById(String tweetId) {
        log.debug("Finding tweet : {}", tweetId);
        return em.find(Tweet.class, tweetId);
    }
}
