package fr.ippon.tatami.service;

import static com.google.common.collect.Lists.newArrayList;

import java.util.Collection;
import java.util.List;

import javax.inject.Inject;

import lombok.extern.apachecommons.CommonsLog;

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
@CommonsLog
public class TimelineService {

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
            login = userService.getCurrentUser().getLogin();
        }
        return this.buildTweetsList(tweetRepository.getTimeline(login, nbTweets));
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
            login = userService.getCurrentUser().getLogin();
        }
        return buildTweetsList(tweetRepository.getUserline(login, nbTweets));
    }

    private Collection<Tweet> buildTweetsList(Collection<String> tweetIds) {
        List<Tweet> tweets = newArrayList();
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
