package fr.ippon.tatami.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.repository.FollowerRepository;
import fr.ippon.tatami.repository.ShortURLRepository;
import fr.ippon.tatami.repository.TweetRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.util.UrlShortener;

/**
 * Manages the timeline.
 *
 * @author Julien Dubois
 */
@Service
public class TimelineService {

    private static final SimpleDateFormat DAYLINE_KEY_FORMAT = new SimpleDateFormat("ddMMyyyy");

    private final Pattern urlPattern1 = Pattern.compile("(http|https):\\/\\/[a-zA-Z0-9-\\/_.\\:\\?=\\&]+(\\b|$)");
    private final Pattern urlPattern2 = Pattern.compile("(^|[^\\/])(w{3}[a-zA-Z0-9-_\\/.\\:\\?=\\&]+(\\b|$))");

    private final Log log = LogFactory.getLog(TimelineService.class);

    private final static Pattern PATTERN_LOGIN = Pattern.compile("@[^\\s]+");

    @Inject
    private UserService userService;

    @Inject
    private TweetRepository tweetRepository;

    @Inject
    private CounterRepository counterRepository;

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private ShortURLRepository shortURLRepository;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private IndexService indexService;

    @Inject
    private UrlShortener urlShortener;

    @Inject
    private boolean indexActivated;

    private final String hashtagDefault = "---";


    /**
     * Return a new content with every URL replaced with a shorten one
     * @param content the content to filter
     * @param urls the short/long URL used in the replacement
     * @return a shorten content
     */
    private String shortenContent(final String content, final Map<String, String> urls) {
        String shortenContent = content;
        for (Map.Entry<String, String> entry : urls.entrySet()) {
            shortenContent = shortenContent.replace(entry.getValue(), entry.getKey());
        }

        return shortenContent.toString();
    }

    /**
     * Return a Map of all the URLs shortened in the content provided, only if shorten URL are effectively shorter than original URL
     * @param content the content to analyze
     * @return a Map of the shorten URLs (short version as a key, original (long) as the value)
     */
    private Map<String, String> getShortenURLs(final String content) {
        final Map<String, String> shortenURLs = new HashMap<String, String>();

        StringBuffer shortenContent = new StringBuffer();
        String input = content;
        Matcher matcher = null;
        String matchUrl, shortenUrl = null;

        matcher = this.urlPattern1.matcher(input);

        while (matcher.find()) {
            matchUrl = matcher.group(0);
            shortenUrl = this.urlShortener.shorten(matchUrl);
            if (shortenUrl.length() < matchUrl.length()) {
                shortenURLs.put(this.urlShortener.shorten(matchUrl), matchUrl);
            }
        }
        matcher.appendTail(shortenContent);

        input = shortenContent.toString();
        shortenContent = new StringBuffer();

        matcher = this.urlPattern2.matcher(input);
        while (matcher.find()) {
            matchUrl = matcher.group(2);
            shortenURLs.put(this.urlShortener.shorten(matchUrl), matchUrl);
        }
        matcher.appendTail(shortenContent);

        return shortenURLs;
    }

    /**
     * Post a tweet :<br>
     * <ul>
     * <li>save it in the datastore</li>
     * <li>update all the related application states</li>
     * </ul>
     * @param content the content to save as a tweet
     * @return the tweet object created on the basis of the content provided
     */
    public Tweet postTweet(final String content) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("Creating new tweet : " + content);
        }

        Map<String, String> map = getShortenURLs(content);
        // Map can be persisted
        String shortenContent = shortenContent(content, map); // enable the content processing to reduce the URLs length

        String currentLogin = this.authenticationService.getCurrentUser().getLogin();
        Tweet tweet = this.tweetRepository.createTweet(currentLogin, shortenContent);

        // add tweet to the dayline, userline, timeline, tagline
        this.tweetRepository.addTweetToDayline(tweet, DAYLINE_KEY_FORMAT.format(tweet.getTweetDate()));
        this.tweetRepository.addTweetToUserline(tweet);
        this.tweetRepository.addTweetToTimeline(currentLogin, tweet);
        this.tweetRepository.addTweetToTagline(tweet);
        for (Map.Entry<String, String> entry : map.entrySet()) {
            this.shortURLRepository.addURLPair(entry.getKey(), entry.getValue());
        }

        // add tweet to the follower's timelines
        Collection<String> followersForUser = this.followerRepository.findFollowersForUser(currentLogin);
        for (String followerLogin : followersForUser) {
            this.tweetRepository.addTweetToTimeline(followerLogin, tweet);
        }

        // add tweet to the mentioned users' timeline
        Matcher m = PATTERN_LOGIN.matcher(tweet.getContent());
        while (m.find()) {
            String mentionedLogin = extractLoginWithoutAt(m.group());
            if (mentionedLogin != null &&
                    !mentionedLogin.equals(currentLogin) &&
                    !followersForUser.contains(mentionedLogin)) {

                this.tweetRepository.addTweetToTimeline(mentionedLogin, tweet);
            }
        }

        // Increment tweet count for the current user
        this.counterRepository.incrementTweetCounter(currentLogin);

        // Add to Elastic Search index if it is activated
        if (this.indexActivated) {
            this.indexService.addTweet(tweet);
        }
        return tweet;
    }

    public Collection<Tweet> buildTweetsList(Collection<String> tweetIds) {
        Collection<Tweet> tweets = new ArrayList<Tweet>(tweetIds.size());
        for (String tweetId : tweetIds) {
            Tweet tweet = this.tweetRepository.findTweetById(tweetId);
            if (tweet == null) {
                this.log.debug("Invisible tweet : " + tweetId);
                continue;
            }
            User tweetUser = this.userService.getUserByLogin(tweet.getLogin());
            tweet.setFirstName(tweetUser.getFirstName());
            tweet.setLastName(tweetUser.getLastName());
            tweet.setGravatar(tweetUser.getGravatar());
            tweets.add(tweet);
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
     * @return a tweets list
     */
    public Collection<Tweet> getTimeline(int nbTweets) {
        String login = this.authenticationService.getCurrentUser().getLogin();
        Collection<String> tweetIds = this.tweetRepository.getTimeline(login, nbTweets);
        return this.buildTweetsList(tweetIds);
    }

    /**
     * The userline contains the user's own tweets
     *
     * @param login    the user to retrieve the userline of
     * @param nbTweets the number of tweets to retrieve, starting from most recent ones
     * @return a tweets list
     */
    public Collection<Tweet> getUserline(String login, int nbTweets) {
        if (login == null || login.isEmpty()) {
            User currentUser = this.authenticationService.getCurrentUser();
            login = currentUser.getLogin();
        }
        Collection<String> tweetIds = this.tweetRepository.getUserline(login, nbTweets);

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
        Tweet tweet = this.tweetRepository.findTweetById(tweetId);

        // registering
        User currentUser = this.authenticationService.getCurrentUser();
        this.tweetRepository.removeTweetFromFavoritesline(tweet, currentUser.getLogin());
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
