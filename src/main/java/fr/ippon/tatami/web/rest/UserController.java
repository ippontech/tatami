package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.IndexService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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
    private boolean indexActivated;

    /**
     * GET  /users/show?screen_name=jdubois -> get the "jdubois" user
     */
    @RequestMapping(value = "/rest/users/show",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public User getUser(@RequestParam("screen_name") String login) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to get Profile : " + login);
        }
        User user = this.userService.getUserProfileByLogin(login);
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
        User currentUser = this.userService.getCurrentUser();
        final String login = currentUser.getLogin();
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to get the last active tweeters list (except " + login + ").");
        }

        Collection<String> exceptions = userService.getFriendIdsForUser(login);
        exceptions.add(login);

        Collection<Tweet> tweets = this.timelineService.getDayline("");
        Map<String, User> users = new HashMap<String, User>();
        for (Tweet tweet : tweets) {
            if (exceptions.contains(tweet.getLogin())) continue;

            users.put(tweet.getLogin(), this.userService.getUserProfileByLogin(tweet.getLogin()));
            if (users.size() == 3) break;    // suggestions list limit
        }
        return users.values();
    }

    /**
     * GET  /users/search -> search user by login<br>
     * Should return a collection of users matching the query.<br>
     * The collection doesn't contain the current user even if he matches the query.<br>
     * If nothing matches, an empty collection (but not null) is returned.<br>
     *
     * @param query the query
     * @return a Collection of User
     */
    @RequestMapping(value = "/rest/users/search",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<User> searchUsers(@RequestParam("q") String query) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to find users starting with : " + query);
        }
        if (this.indexActivated) {
            final List<String> logins = this.indexService.searchPrefix(User.class, null, "login", query, 0, 20);
            final Collection<User> users = this.userService.getUsersByLogin(logins);
            final User currentUser = this.userService.getCurrentUser();
            users.remove(currentUser);
            return users;
        } else {
            return new ArrayList<User>();
        }
    }

}
