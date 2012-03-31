package fr.ippon.tatami.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.repository.FollowerRepository;
import fr.ippon.tatami.repository.TweetRepository;
import fr.ippon.tatami.security.AuthenticationService;

/**
 * Manages the the timeline.
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

    @Value("${hashtag.default}")
    private String hashtagDefault;

    private static final SimpleDateFormat DAYLINE_KEY_FORMAT = new SimpleDateFormat("ddMMyyyy");
    
    private final Log log = LogFactory.getLog(TimelineService.class);

	private final static String PATTERN_LOGGIN = "@[^\\s]+";
	
	private final static Pattern PATTERN_COMPILER = Pattern.compile(PATTERN_LOGGIN);
    
	public void postTweet(String content) {
        if (log.isDebugEnabled()) {
            log.debug("Creating new tweet : " + content);
        }
        User currentUser = authenticationService.getCurrentUser();
		Tweet tweet = processTweet(currentUser.getLogin(), content); 
		spreadTweet(currentUser.getLogin(), tweet);
    }

	public void postTweetTo(String content, String login) {
        if (log.isDebugEnabled()) {
            log.debug("Creating new tweet : " + content);
        }
        processTweet(login, content); 
    }
	
	public void broadCastTweet(String content){
		
		String login = null;
		User currentUser = authenticationService.getCurrentUser();
		String userLogin = currentUser.getLogin();
		
		Matcher m = PATTERN_COMPILER.matcher(content);
		while(m.find()){
			login = extractLoginWithoutAt(m.group());
			if(isNotTheCurrentLogin(userLogin, login)){
				distributeTweet(login, content);
			}
		}
	}

	private Collection<Tweet> buildTweetsList(Collection<String> tweetIds) {
		Collection<Tweet> tweets = new ArrayList<Tweet>(tweetIds.size());
		for (String tweetId : tweetIds) {
			Tweet tweet = tweetRepository.findTweetById(tweetId);
			if (tweet == null) {
				log.debug("Invisible tweet : " + tweetId);
				continue;
			}
			User tweetUser = userService.getUserByLogin(tweet.getLogin());
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
        Collection<String> tweetIds = tweetRepository.getDayline(date);

        return this.buildTweetsList(tweetIds);
    }

    /**
     * The dayline contains a day's tweets
     *
     * @param date the day to retrieve the tweets of
     * @return a tweets list
     */
    public Collection<Tweet> getDayline(Date date) {
        if (date == null)	date = new Date();
        Collection<String> tweetIds = tweetRepository.getDayline(DAYLINE_KEY_FORMAT.format(date));

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
            tag = hashtagDefault;
        }
        Collection<String> tweetIds = tweetRepository.getTagline(tag, nbTweets);

        return this.buildTweetsList(tweetIds);
    }

    /**
     * The timeline contains the user's tweets merged with his friends tweets
     *
     * @param login    the user to retrieve the timeline of
     * @param nbTweets the number of tweets to retrieve, starting from most recent ones
     * @return a tweets list
     */
    public Collection<Tweet> getTimeline(String login, int nbTweets) {
        if (login == null || login.isEmpty()) {
            User currentUser = authenticationService.getCurrentUser();
            login = currentUser.getLogin();
        }
        Collection<String> tweetIds = tweetRepository.getTimeline(login, nbTweets);

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
            User currentUser = authenticationService.getCurrentUser();
            login = currentUser.getLogin();
        }
        Collection<String> tweetIds = tweetRepository.getUserline(login, nbTweets);

        return this.buildTweetsList(tweetIds);
    }

    public boolean removeTweet(String tweetId) {
        if (log.isDebugEnabled()) {
            log.debug("Removing tweet : " + tweetId);
        }
        Tweet tweet = tweetRepository.findTweetById(tweetId);

        User currentUser = authenticationService.getCurrentUser();
        if (tweet.getLogin().equals(currentUser.getLogin())
        		&& !Boolean.TRUE.equals(tweet.getRemoved())) {
			tweetRepository.removeTweet(tweet);
			counterRepository.decrementTweetCounter(currentUser.getLogin());
			return true;
		}
        return false;
    }

    public void addFavoriteTweet(String tweetId) {
        if (log.isDebugEnabled()) {
            log.debug("Marking tweet : " + tweetId);
        }
        Tweet tweet = tweetRepository.findTweetById(tweetId);

        // registering
        User currentUser = authenticationService.getCurrentUser();
		tweetRepository.addTweetToFavoritesline(tweet, currentUser.getLogin());

		// alerting
		if (!currentUser.getLogin().equals(tweet.getLogin())) {
			String content = '@' + currentUser.getLogin() + " liked your tweet<br/><em>_PH_...</em>";
			int maxLength = 140 - content.length() + 4;
			if (tweet.getContent().length() > maxLength) {
				content = content.replace("_PH_", tweet.getContent().substring(0, maxLength));
			} else {
				content = content.replace("_PH_", tweet.getContent());
			}

			Tweet helloTweet = tweetRepository.createTweet(tweet.getLogin(), content); // removable
			tweetRepository.addTweetToTimeline(tweet.getLogin(), helloTweet);
		}
    }

    /**
     * The favline contains the user's favorites tweets
     * 
     * @param login
     * 		the user to retrieve the favline of
     * @return a tweets list
     */
    public Collection<Tweet> getFavoritesline(String login) {
    	if (login == null || login.isEmpty()) {
	        User currentUser = authenticationService.getCurrentUser();
	        login = currentUser.getLogin();
    	}
        Collection<String> tweetIds = tweetRepository.getFavoritesline(login);

        return this.buildTweetsList(tweetIds);
    }

    public void setAuthenticationService(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }
    
    private void spreadTweet(String login, Tweet tweet){
        for (String followerLogin : followerRepository.findFollowersForUser(login)) {
            tweetRepository.addTweetToTimeline(followerLogin, tweet);
        }
    }
    
	private Tweet processTweet(String login, String content){
		Tweet tweet = tweetRepository.createTweet(login, content);
	   
	 	// registering
		registerTweet(tweet, login);

        // referencing
        tweetRepository.addTweetToTagline(tweet);

        counterRepository.incrementTweetCounter(login);
        
        return tweet;
	}

    private void registerTweet(Tweet tweet, String login){
		tweetRepository.addTweetToDayline(tweet, DAYLINE_KEY_FORMAT.format(tweet.getTweetDate()));
        tweetRepository.addTweetToUserline(tweet);
        tweetRepository.addTweetToTimeline(login, tweet);
	}
	
	private boolean isValidUser(User user){
		return null!=user && null!=user.getLogin();
	}

	private String extractLoginWithoutAt(String dest){
		return dest.substring(1, dest.length());
	}

	private void distributeTweet(String mentioned, String content){
		User user = userService.getUserByLogin(mentioned);
		if(isValidUser(user)){
			postTweetTo(content,mentioned);
		}
	}
	
	private boolean isNotTheCurrentLogin(String userLogin, String dest){
		return null!=userLogin && !userLogin.equals(dest);
	}
}
