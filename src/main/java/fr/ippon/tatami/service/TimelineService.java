package fr.ippon.tatami.service;

import java.util.ArrayList;
import java.util.Collection;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.repository.FollowerRepository;
import fr.ippon.tatami.repository.TweetRepository;

/**
 * Manages the the timeline.
 * 
 * @author Julien Dubois
 */
@Service
public class TimelineService {

    private final Log log = LogFactory.getLog(TimelineService.class);

    @Inject
    private UserService userService;

    @Inject
    private TweetRepository tweetRepository;

    @Inject
    private CounterRepository counterRepository;

    @Inject
    private FollowerRepository followerRepository;

    public void postTweet(String content) {
        if (log.isDebugEnabled()) {
            log.debug("Creating new tweet : " + content);
        }
        User currentUser = userService.getCurrentUser();

        Tweet tweet = tweetRepository.createTweet(currentUser.getLogin(), content);
        tweetRepository.addTweetToUserline(tweet);
        tweetRepository.addTweetToTimeline(currentUser.getLogin(), tweet);
        for (String followerLogin : followerRepository.findFollowersForUser(currentUser.getLogin())) {
            tweetRepository.addTweetToTimeline(followerLogin, tweet);
        }
        counterRepository.incrementTweetCounter(currentUser.getLogin());
    }

    /**
     * The timeline contains the user's tweets merged with his friends tweets
     * 
     * @param login
     *            the user to retrieve the timeline of
     * @param nbTweets
     *            the number of tweets to retrieve, starting from most recent ones
     * @return a tweets list
     */
    public Collection<Tweet> getTimeline(String login, int nbTweets) {
        if (login == null || login.isEmpty()) {
            User currentUser = userService.getCurrentUser();
            login = currentUser.getLogin();
        }
        Collection<String> tweetIds = tweetRepository.getTimeline(login, nbTweets);

        return this.buildTweetsList(tweetIds);
    }

    /**
     * The userline contains the user's own tweets
     * 
     * @param login
     *            the user to retrieve the userline of
     * @param nbTweets
     *            the number of tweets to retrieve, starting from most recent ones
     * @return a tweets list
     */
    public Collection<Tweet> getUserline(String login, int nbTweets) {
        if (login == null || login.isEmpty()) {
            User currentUser = userService.getCurrentUser();
            login = currentUser.getLogin();
        }
        Collection<String> tweetIds = tweetRepository.getUserline(login, nbTweets);

        return this.buildTweetsList(tweetIds);
    }

    private Collection<Tweet> buildTweetsList(Collection<String> tweetIds) {
        Collection<Tweet> tweets = new ArrayList<Tweet>(tweetIds.size());
        for (String tweedId : tweetIds) {
            Tweet tweet = tweetRepository.findTweetById(tweedId);
            User tweetUser = userService.getUserByLogin(tweet.getLogin());
            tweet.setFirstName(tweetUser.getFirstName());
            tweet.setLastName(tweetUser.getLastName());
            tweet.setGravatar(tweetUser.getGravatar());
            tweets.add(tweet);
        }
        return tweets;
    }
}
