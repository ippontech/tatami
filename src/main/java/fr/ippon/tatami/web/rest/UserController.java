package fr.ippon.tatami.web.rest;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.CounterService;
import fr.ippon.tatami.service.IndexService;
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
    
    @Inject
    private IndexService indexService;
    
    @Inject
    private CounterService counterService;

    @Inject
    private AuthenticationService authenticationService;

    @RequestMapping(value = "/profile/{login}",
            method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView getUserProfile(@PathVariable("login") String login) {
        if (log.isDebugEnabled()) {
            log.debug("Request to get Profile : " + login);
        }
        ModelAndView mav = new ModelAndView();
        mav.setViewName("profile");
        User user = userService.getUserProfileByLogin(login);
        if(null!=user){
        	mav.addObject("user", user);
        	mav.addObject("followed", userService.isFollowed(login));
	        mav.addObject("nbTweets", counterService.getNbTweets(login));
	        mav.addObject("nbFollowed", counterService.getNbFollowed(login));
	        mav.addObject("nbFollowers", counterService.getNbFollowers(login));
        };
        return mav;
    }
    
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
    public void updateUser(@PathVariable("login") String login, @RequestBody User user)  throws ConstraintViolationException, IllegalArgumentException {
        if (log.isDebugEnabled()) {
            log.debug("REST request to update user : " + login);
        }
        
        String cleanedContent = Jsoup.clean(login, Whitelist.basic());
        if(null!=login && login.equals(cleanedContent)){
        	user.setLogin(login);
            user.setEmail(Jsoup.clean(user.getEmail(), Whitelist.basic()));
            user.setFirstName(Jsoup.clean(user.getFirstName(), Whitelist.basic()));
            user.setLastName(Jsoup.clean(user.getLastName(), Whitelist.basic()));
            try{
            	userService.updateUser(user);
            }catch(ConstraintViolationException cve ){
            	throw new IllegalArgumentException("Illegal Argument : One of the data in under an invalid format.");
            }
        }else{
        	throw new IllegalArgumentException("Illegal Argument : Content of the tweet.");
        }
    }

    @RequestMapping(value = "/rest/users/{login}/followUser",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    public void followUser(@PathVariable("login") String login, @RequestBody String loginToFollow) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to follow user login : " + loginToFollow);
        }
        User currentUser = authenticationService.getCurrentUser();
        if (currentUser.getLogin().equals(login)) {
            userService.followUser(loginToFollow);
            log.info("Completed");
        } else {
            log.warn("Cannot follow a user for another user.");
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
        User currentUser = authenticationService.getCurrentUser();
        if (currentUser.getLogin().equals(login)) {
            userService.forgetUser(friend);
            log.info("Completed");
        } else {
            log.warn("Cannot remove a friend from another user");
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

        Collection<Tweet> tweets = timelineService.getDayline("");
        Map<String, User> users = new HashMap<String, User>();
        for (Tweet tweet : tweets) {
            if (exceptions.contains(tweet.getLogin())) continue;

            users.put(tweet.getLogin(), userService.getUserProfileByLogin(tweet.getLogin()));
            if (users.size() == 3) break;    // suggestions list limit
        }
        return users.values();
    }

    @RequestMapping(value = "/rest/removeTweet/{tweet}",
            method = RequestMethod.GET)
    @ResponseBody
    public void removeTweet(@PathVariable("tweet") String tweet) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to remove tweet : " + tweet);
        }
        if (!timelineService.removeTweet(tweet)) {
            log.warn("Could not remove tweet ; wether it's already deleted or owned by another user.");
        } else {
            log.info("Completed");
        }
    }

    @RequestMapping(value = "/rest/likeTweet/{tweet}",
            method = RequestMethod.GET)
    @ResponseBody
    public void likeTweet(@PathVariable("tweet") String tweet) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to like tweet : " + tweet);
        }
        timelineService.addFavoriteTweet(tweet);
        log.info("Completed");
    }
     
    @RequestMapping(value = "/rest/users/similar/{login}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public List<String> getUsersPossibility(@PathVariable("login") String login) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get users possibilites for a suggestion : " + login);
        }
        return indexService.searchSimilarUsers(login);
    }
}
