package fr.ippon.tatami.web.rest;

import static com.google.common.collect.Lists.newArrayList;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

import java.util.Collection;
import java.util.List;

import javax.inject.Inject;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.UserService;

/**
 * REST controller for managing users.
 * 
 * @author Julien Dubois
 */
@Controller
@Slf4j
public class UserController {

    @Inject
    private UserService userService;

    @RequestMapping(value = "/rest/users/{login}", method = GET, produces = "application/json")
    @ResponseBody
    public User getUser(@PathVariable("login") String login) {
        log.debug("REST request to get Profile : {}", login);
        return userService.getUserProfileByLogin(login);
    }

    @RequestMapping(value = "/rest/users/{login}", method = POST, consumes = "application/json")
    @ResponseBody
    public void updateUser(@PathVariable("login") String login, @RequestBody User user) {
        log.debug("REST request to update user : {}", login);
        user.setLogin(login);
        userService.updateUser(user);
    }

    @RequestMapping(value = "/rest/users/{login}/followUser", method = POST, consumes = "application/json")
    @ResponseBody
    public void followUser(@PathVariable("login") String login, @RequestBody String loginToFollow) {
        log.debug("REST request to follow user login : {}", loginToFollow);
        User currentUser = userService.getCurrentUser();
        if (currentUser.getLogin().equals(login)) {
            userService.followUser(loginToFollow);
        } else {
            log.info("Cannot follow a user for another user");
        }
    }

    @RequestMapping(value = "/rest/users/{login}/removeFriend", method = POST, consumes = "application/json")
    @ResponseBody
    public void removeFriend(@PathVariable("login") String login, @RequestBody String friend) {
        log.debug("REST request to remove friendLogin : {}", friend);
        User currentUser = userService.getCurrentUser();
        if (currentUser.getLogin().equals(login)) {
            userService.forgetUser(friend);
        } else {
            log.info("Cannot remove a friend from another user");
        }
    }

    @RequestMapping(value = "/rest/suggestions", method = GET, produces = "application/json")
    @ResponseBody
    public Collection<User> suggestions() {
        // TODO to implement
        List<User> mock = newArrayList();
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
