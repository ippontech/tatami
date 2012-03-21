package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;

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
    private AuthenticationService authenticationService;

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
        User currentUser = authenticationService.getCurrentUser();
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
        User currentUser = authenticationService.getCurrentUser();
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
        // TODO to implement
        Collection<User> mock = new ArrayList<User>();
        User jdubois = userService.getUserByLogin("jdubois");
        if (jdubois != null) {
            mock.add(jdubois);
        }
        User tescolan = userService.getUserByLogin("tescolan");
        if (tescolan != null) {
            mock.add(tescolan);
        }
		return mock;
    }
}