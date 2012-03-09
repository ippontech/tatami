package fr.ippon.tatami.web.rest;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.ippon.tatami.domain.User;
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

    @RequestMapping(value = "/rest/users/{login}/setProfile",
    		method = RequestMethod.POST,
    		consumes = "application/json")
    @ResponseBody
    public void setUser(@PathVariable("login") String login, @RequestBody String[] infos) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to set Profile : " + login);
        }
        //TODO use variables and not array
        userService.updateUser(login, infos[0], infos[1], infos[2]);
    }

    @RequestMapping(value = "/rest/users/{login}/addFriend",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json")
    public void addFriend(@PathVariable("login") String login, @RequestBody String friend) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to add friend : " + friend);
        }
        User currentUser = userService.getCurrentUser();
        if (currentUser.getLogin().equals(login)) {
            userService.followUser(friend);
        } else {
            log.info("Cannot add a friend to another user");
        }
    }
}
