package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.CounterService;
import fr.ippon.tatami.service.IndexService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.UserService;
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
    private boolean indexActivated;

    //TODO
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
     * GET  /users/show?screen_name=jdubois -> get the "jdubois" user
     */
    @RequestMapping(value = "/rest/users/show",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public User getUser(@RequestParam("screen_name") String login) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get Profile : " + login);
        }
        User user = userService.getUserProfileByLogin(login);
        return user;
    }

    /**
     * GET  /users/suggestions -> suggest users to follow
     */
    @RequestMapping(value = "/rest/users/suggestions",
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
     * GET  /users/search -> search user by login
     */
    @RequestMapping(value = "/rest/users/search",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public List<String> searchUsers(@RequestParam("q") String query) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to find users starting with : " + query);
        }
        if (indexActivated) {
            return indexService.searchSimilarUsers(query);
        } else {
            return new ArrayList<String>();
        }
    }

}
