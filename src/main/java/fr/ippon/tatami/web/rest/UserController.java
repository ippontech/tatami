package fr.ippon.tatami.web.rest;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.TreeSet;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.UserService;

/**
 * REST controller for managing users.
 *
 * @author Julien Dubois
 */
@Controller
public class UserController {

    private final Log log = LogFactory.getLog(UserController.class);

    @Inject
    private TimelineService timelineService;

    @Inject
    private UserService userService;

    @RequestMapping(value = "/rest/users/{login}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public User getUser(@PathVariable("login") String login) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get Profile : " + login);
        }
        return userService.getUserProfileByLogin(login);
    }

    @RequestMapping(value = "/rest/users/{login}",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    public void updateUser(@PathVariable("login") String login, @RequestBody User user) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to update user : " + login);
        }
        user.setLogin(login);
        userService.updateUser(user);
    }

    @RequestMapping(value = "/rest/users/{login}/followUser",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    public void followUser(@PathVariable("login") String login, @RequestBody String loginToFollow) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to follow user login : " + loginToFollow);
        }
        User currentUser = userService.getCurrentUser();
        if (currentUser.getLogin().equals(login)) {
            userService.followUser(loginToFollow);
        } else {
            log.info("Cannot follow a user for another user");
        }
    }

    @RequestMapping(value = "/rest/users/{login}/removeFriend",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    public void removeFriend(@PathVariable("login") String login, @RequestBody String friend) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to remove friendLogin : " + friend);
        }
        User currentUser = userService.getCurrentUser();
        if (currentUser.getLogin().equals(login)) {
            userService.forgetUser(friend);
        } else {
            log.info("Cannot remove a friend from another user");
        }
    }

    @RequestMapping(value = "/rest/suggestions",
    		method = RequestMethod.GET,
    		produces = "application/json")
    @ResponseBody
    public Collection<User> suggestions() {
        User currentUser = userService.getCurrentUser();
        final String login = currentUser.getLogin();
        if (log.isDebugEnabled()) {
            log.debug("REST request to get the last active tweeters list (except " + login + ").");
        }

        Collection<String> exceptions = userService.getFriendsForUser(login);
        exceptions.add(login);

        String date = null;	//TODO parameterized version
        Collection<Tweet> tweets = timelineService.getDayline(date, 0);
		Map<String, User> users = new HashMap<String, User>();
        for (Tweet tweet : tweets) {
        	if (exceptions.contains(tweet.getLogin()))	continue;

        	users.put(tweet.getLogin(), userService.getUserProfileByLogin(tweet.getLogin()));
        	if (users.size() == 3)	break;	// suggestions list limit
		}
		return users.values();
    }

    @RequestMapping(value = "/rest/tweetStats",
    		method = RequestMethod.GET,
    		produces = "application/json")
    @ResponseBody
    public Collection<String> tweetStats() {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get the users stats.");
        }

        String date = null;	//TODO parameterized version
		Map<String, Integer> users = new HashMap<String, Integer>();
        Collection<Tweet> tweets;
        int pos = 0;
        do {
        	tweets = timelineService.getDayline(date, pos);
            for (Tweet tweet : tweets) {
            	Integer count = users.get(tweet.getLogin());
            	if (count != null) {
            		count = count.intValue() + 1;
            	} else {
            		count = 1;
            	}
        		users.put(tweet.getLogin(), count);
    		}
        } while (!tweets.isEmpty());

        Set<String> stats = new TreeSet<String>();
        for (Entry<String, Integer> entry : users.entrySet()) {
        	stats.add("UserStat{login='" + entry.getKey() + "', tweetsCount='" + entry.getValue() + "'}");
        }
		return stats;
    }
}
