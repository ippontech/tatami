package fr.ippon.tatami.web.rest;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.UserStatusStat;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.FriendshipService;
import fr.ippon.tatami.service.SearchService;
import fr.ippon.tatami.service.StatsService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;

/**
 * REST controller for managing users.
 *
 * @author Julien Dubois
 */
@Controller
public class UserController {

    private final Log log = LogFactory.getLog(UserController.class);

    @Inject
    private StatsService statsService;

    @Inject
    private UserService userService;

    @Inject
    private FriendshipService friendshipService;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private SearchService searchService;

    /**
     * GET  /users/show?screen_name=jdubois -> get the "jdubois" user
     */
    @RequestMapping(value = "/rest/users/show",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public User getUser(@RequestParam("screen_name") String username) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to get Profile : " + username);
        }
        User user = userService.getUserByUsername(username);
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
        User currentUser = authenticationService.getCurrentUser();
        String currentLogin = currentUser.getLogin();
        String currentUsername = DomainUtil.getUsernameFromLogin(currentLogin);
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to get the last active users list (except " + currentUsername + ").");
        }

        Collection<String> exceptions = friendshipService.getFriendIdsForUser(currentLogin);
        exceptions.add(currentLogin);

        Collection<UserStatusStat> stats = statsService.getDayline();
        Map<String, User> users = new HashMap<String, User>();
        for (UserStatusStat stat : stats) {
            User potentialFriend = userService.getUserByUsername(stat.getUsername());
            if (exceptions.contains(potentialFriend.getLogin())) {
                continue;
            }
            users.put(potentialFriend.getUsername(), potentialFriend);
            if (users.size() == 3) {
                break;    // suggestions list limit
            }
        }
        return users.values();
    }

    /**
     * GET  /users/searchStatus -> searchStatus user by username<br>
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
        String prefix = query.toLowerCase();
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to find users starting with : " + prefix);
        }
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Collection<String> logins = searchService.searchUserByPrefix(domain, prefix);
        return userService.getUsersByLogin(logins);
    }
}
