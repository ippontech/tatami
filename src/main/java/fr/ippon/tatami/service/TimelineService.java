package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.repository.FollowerRepository;
import fr.ippon.tatami.repository.TweetRepository;
import fr.ippon.tatami.security.AuthenticationService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Manages the timeline.
 *
 * @author Julien Dubois
 */
@Service
public class TimelineService {

    @Inject
    private UserService userService;

    @Inject
    private TweetRepository tweetRepository;

    @Inject
    private CounterRepository counterRepository;

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private IndexService indexService;

    @Inject
    private boolean indexActivated;

    private String hashtagDefault = "---";

    private static final SimpleDateFormat DAYLINE_KEY_FORMAT = new SimpleDateFormat("ddMMyyyy");

    private final Log log = LogFactory.getLog(TimelineService.class);

    private final static Pattern PATTERN_LOGIN = Pattern.compile("@[^\\s]+");

    public void postTweet(String content) {
        if (log.isDebugEnabled()) {
            log.debug("Creating new tweet : " + content);
        }
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        Tweet tweet = tweetRepository.createTweet(currentLogin, content);

        // add tweet to the dayline, userline, timeline, tagline
        tweetRepository.addTweetToDayline(tweet, DAYLINE_KEY_FORMAT.format(tweet.getTweetDate()));
        tweetRepository.addTweetToUserline(tweet);
        tweetRepository.addTweetToTimeline(currentLogin, tweet);
        tweetRepository.addTweetToTagline(tweet);

        // add tweet to the follower's timelines
        Collection<String> followersForUser = followerRepository.findFollowersForUser(currentLogin);
        for (String followerLogin : followersForUser) {
            tweetRepository.addTweetToTimeline(followerLogin, tweet);
        }

        // add tweet to the mentioned users' timeline
        Matcher m = PATTERN_LOGIN.matcher(tweet.getContent());
        while (m.find()) {
            String mentionedLogin = extractLoginWithoutAt(m.group());
            if (mentionedLogin != null &&
                    !mentionedLogin.equals(currentLogin) &&
                    !followersForUser.contains(mentionedLogin)) {

                tweetRepository.addTweetToTimeline(mentionedLogin, tweet);
            }
        }

        // Increment tweet count for the current user
        counterRepository.incrementTweetCounter(currentLogin);

        // Add to Elastic Search index if it is activated
        if (indexActivated) {
            indexService.addTweet(tweet);
        }
    }

    public Collection<Tweet> buildTweetsList(Collection<String> tweetIds) {
        String login = authenticationService.getCurrentUser().getLogin();
        Collection<String> favoriteIds = tweetRepository.getFavoritesline(login);
        Collection<Tweet> tweets = new ArrayList<Tweet>(tweetIds.size());
        for (String tweetId : tweetIds) {
            Tweet tweet = this.tweetRepository.findTweetById(tweetId);
            if (tweet == null) {
                this.log.debug("Invisible tweet : " + tweetId);
                continue;
            }
            // if the Tweet comes from ehcache, it has to be cloned to another instance
            // in order to be thread-safe.
            // ehcache shares the Tweet instances per tweetId, but favorites are per user.
            Tweet tweetCopy = new Tweet();
            tweetCopy.setTweetId(tweet.getTweetId());
            tweetCopy.setContent(tweet.getContent());
            tweetCopy.setLogin(tweet.getLogin());
            tweetCopy.setTweetDate(tweet.getTweetDate());
            if (favoriteIds.contains(tweetId)) {
                tweetCopy.setFavorite(true);
            } else {
                tweetCopy.setFavorite(false);
            }
            User tweetUser = userService.getUserByLogin(tweet.getLogin());
            tweetCopy.setFirstName(tweetUser.getFirstName());
            tweetCopy.setLastName(tweetUser.getLastName());
            tweetCopy.setGravatar(tweetUser.getGravatar());
            tweets.add(tweetCopy);
        }
        return tweets;
    }

    /**
     * The dayline contains a day's tweets
     *
     * @param date the day's name to retrieve the tweets of
     * @return a tweets list
     */
    public Collection<Tweet> getDayline(String date) {
        if (date == null || date.isEmpty() || !date.matches("^\\d{8}$")) {
            date = DAYLINE_KEY_FORMAT.format(new Date());
        }
        Collection<String> tweetIds = this.tweetRepository.getDayline(date);

        return this.buildTweetsList(tweetIds);
    }

    /**
     * The dayline contains a day's tweets
     *
     * @param date the day to retrieve the tweets of
     * @return a tweets list
     */
    public Collection<Tweet> getDayline(Date date) {
        if (date == null) date = new Date();
        Collection<String> tweetIds = this.tweetRepository.getDayline(DAYLINE_KEY_FORMAT.format(date));

        return this.buildTweetsList(tweetIds);
    }

    /**
     * The tagline contains a tag's tweets
     *
     * @param tag      the tag to retrieve the timeline of
     * @param nbTweets the number of tweets to retrieve, starting from most recent ones
     * @return a tweets list
     */
    public Collection<Tweet> getTagline(String tag, int nbTweets) {
        if (tag == null || tag.isEmpty()) {
            tag = this.hashtagDefault;
        }
        Collection<String> tweetIds = this.tweetRepository.getTagline(tag, nbTweets);

        return this.buildTweetsList(tweetIds);
    }

    /**
     * The timeline contains the user's tweets merged with his friends tweets
     *
     * @param nbTweets the number of tweets to retrieve, starting from most recent ones
     * @param since_id
     * @param max_id   @return a tweets list
     */
    public Collection<Tweet> getTimeline(int nbTweets, String since_id, String max_id) {
        String login = authenticationService.getCurrentUser().getLogin();
        Collection<String> tweetIds = tweetRepository.getTimeline(login, nbTweets, since_id, max_id);
        return this.buildTweetsList(tweetIds);
    }

    /**
     * The userline contains the user's own tweets
     *
     * @param login    the user to retrieve the userline of
     * @param nbTweets the number of tweets to retrieve, starting from most recent ones
     * @return a tweets list
     */
    public Collection<Tweet> getUserline(String login, int nbTweets, String since_id, String max_id) {
        if (login == null || login.isEmpty()) {
            User currentUser = this.authenticationService.getCurrentUser();
            login = currentUser.getLogin();
        }
        Collection<String> tweetIds = tweetRepository.getUserline(login, nbTweets, since_id, max_id);
        return this.buildTweetsList(tweetIds);
    }

    public void removeTweet(String tweetId) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("Removing tweet : " + tweetId);
        }
        final Tweet tweet = this.tweetRepository.findTweetById(tweetId);

        final User currentUser = this.authenticationService.getCurrentUser();
        if (tweet.getLogin().equals(currentUser.getLogin())
                && !Boolean.TRUE.equals(tweet.getRemoved())) {
            this.tweetRepository.removeTweet(tweet);
            this.counterRepository.decrementTweetCounter(currentUser.getLogin());
            if (this.indexActivated) {
                this.indexService.removeTweet(tweet);
            }
        }
    }

    public void addFavoriteTweet(String tweetId) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("Marking tweet : " + tweetId);
        }
        Tweet tweet = this.tweetRepository.findTweetById(tweetId);

        // registering
        User currentUser = this.authenticationService.getCurrentUser();
        this.tweetRepository.addTweetToFavoritesline(tweet, currentUser.getLogin());

        // alerting
        if (!currentUser.getLogin().equals(tweet.getLogin())) {
            String content = '@' + currentUser.getLogin() + " liked your tweet<br/><em>_PH_...</em>";
            int maxLength = 140 - content.length() + 4;
            if (tweet.getContent().length() > maxLength) {
                content = content.replace("_PH_", tweet.getContent().substring(0, maxLength));
            } else {
                content = content.replace("_PH_", tweet.getContent());
            }

            Tweet helloTweet = this.tweetRepository.createTweet(tweet.getLogin(), content); // removable
            this.tweetRepository.addTweetToTimeline(tweet.getLogin(), helloTweet);
        }
    }

    public void removeFavoriteTweet(String tweetId) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("Unmarking tweet : " + tweetId);
        }
        Tweet tweet = tweetRepository.findTweetById(tweetId);
        User currentUser = authenticationService.getCurrentUser();
        tweetRepository.removeTweetFromFavoritesline(tweet, currentUser.getLogin());
    }

    /**
     * The favline contains the user's favorites tweets
     *
     * @return a tweets list
     */
    public Collection<Tweet> getFavoritesline() {
        String login = this.authenticationService.getCurrentUser().getLogin();
        Collection<String> tweetIds = this.tweetRepository.getFavoritesline(login);
        return this.buildTweetsList(tweetIds);
    }

    public void setAuthenticationService(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    private String extractLoginWithoutAt(String dest) {
        return dest.substring(1, dest.length());
    }

}
