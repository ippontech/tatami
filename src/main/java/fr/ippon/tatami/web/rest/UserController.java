package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.CounterService;
import fr.ippon.tatami.service.IndexService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;
import java.util.*;

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

    @Inject
    private boolean indexActivated;

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
        if (null != user) {
            mav.addObject("user", user);
            mav.addObject("followed", userService.isFollowed(login));
            mav.addObject("nbTweets", counterService.getNbTweets(login));
            mav.addObject("nbFollowed", counterService.getNbFollowed(login));
            mav.addObject("nbFollowers", counterService.getNbFollowers(login));
        }
        return mav;
    }

    /**
     * POST /tatami/rest/users/jdubois -> update the "jdubois" user
     */
    @RequestMapping(value = "/rest/users/{login}",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    public void updateUser(@PathVariable("login") String login, @RequestBody User user) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to update user : " + login);
        }
        user.setLogin(login);
        user.setFirstName(StringEscapeUtils.escapeHtml(user.getFirstName()));
        user.setLastName(StringEscapeUtils.escapeHtml(user.getLastName()));
        userService.updateUser(user);
    }


    /**
     * POST /tatami/rest/users/jdubois/follow -> follow user "jdubois"
     */
    @RequestMapping(value = "/rest/users/{login}/follow",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    public void followUser(@PathVariable("login") String loginToFollow) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to follow user login : " + loginToFollow);
        }
        userService.followUser(loginToFollow);
    }

    /**
     * POST /tatami/rest/users/jdubois/unfollow -> unfollow user "jdubois"
     */
    @RequestMapping(value = "/rest/users/{login}/unfollow",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    public void unfollowUser(@PathVariable("login") String loginToUnfollow) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to unfollow user login  : " + loginToUnfollow);
        }
        userService.unfollowUser(loginToUnfollow);
    }

    /**
     *  GET  /tatami/rest/users/jdubois -> get the "jdubois" user
     */
    @RequestMapping(value = "/rest/users/{login}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public User getUser(@PathVariable("login") String login) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get Profile : " + login);
        }
        User user = userService.getUserProfileByLogin(login);
        return user;
    }

    /**
     * GET  /tatami/rest/users/jdubois/tweets -> get the latest tweets from user "jdubois"
     */
    @RequestMapping(value = "/rest/users/{login}/tweets",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Tweet> listTweetsForUser(@PathVariable("login") String login) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get someone's tweets (" + login + ").");
        }
        return timelineService.getUserline(login, 20);
    }

    /**
     * GET  /tatami/rest/users/jdubois/favorites -> get the favorite tweets of user "jdubois"
     */
    @RequestMapping(value = "/rest/users/{login}/favorites",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Tweet> listFavoriteTweets(@PathVariable("login") String login) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get someone's favorite tweet list (" + login + ").");
        }
        return timelineService.getFavoritesline(login);
    }

    /**
     * GET  /tatami/rest/suggestions -> suggest users to follow
     */
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

    /**
     * GET  /tatami/rest/users/jdub/autocomplete -> autocomplete login starting with "jdub"
     */
    @RequestMapping(value = "/rest/users/{login}/autocomplete",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public List<String> findSimilarUsers(@PathVariable("login") String login) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get users possibilites for a suggestion : " + login);
        }
        if (indexActivated) {
            return indexService.searchSimilarUsers(login);
        } else {
            return new ArrayList<String>();
        }
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

}
