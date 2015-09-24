package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Timed;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.SearchService;
import fr.ippon.tatami.service.SuggestionService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.dto.UserDTO;
import fr.ippon.tatami.service.util.DomainUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.util.Collection;

/**
 * REST controller for managing users.
 *
 * @author Julien Dubois
 */
@Controller
public class UserController {

    private final Logger log = LoggerFactory.getLogger(UserController.class);

    @Inject
    private UserService userService;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private SearchService searchService;

    @Inject
    private SuggestionService suggestionService;

    /**
     * GET  /rest/users/:username -> get the "jdubois" user
     */
    @RequestMapping(value = "/rest/users/{username}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public UserDTO getUser(@PathVariable("username") String username) {
        this.log.debug("REST request to get Profile : {}", username);
        User user = userService.getUserByUsername(username);

        return userService.buildUserDTO(user);
    }

    /**
     * GET  /users/suggestions -> suggest users to follow
     */
    @RequestMapping(value = "/rest/users/suggestions",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<User> suggestions() {
        String login = authenticationService.getCurrentUser().getLogin();
        return suggestionService.suggestUsers(login);
    }

    /**
     * GET  /rest/users/search -> search users by prefix<br>
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
    @Timed
    public Collection<User> searchUsers(@RequestParam("q") String query) {
        String prefix = query.toLowerCase();
        this.log.debug("REST request to find users starting with : {}", prefix);
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Collection<String> logins = searchService.searchUserByPrefix(domain, prefix);
        return userService.getUsersByLogin(logins);
    }

    /**
     * GET  /users -> Get all users of domain
     */
    @RequestMapping(value = "/rest/users",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<User> getAll(@RequestParam(required = false) Integer pagination) {
        if (pagination == null) {
            pagination = 0;
        }
        return userService.getUsersForCurrentDomain(pagination);
    }

    /**
     * POST  /users -> Register new user
     */
    @RequestMapping(value = "/rest/users",
            method = RequestMethod.POST,
            produces = "application/json")
    @ResponseBody
    public void register(@RequestParam String email, HttpServletResponse response) {
        email = email.toLowerCase();
        if (userService.getUserByLogin(email) != null) {
            response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
            return;
        }
        User user = new User();
        user.setLogin(email);
        userService.registerUser(user);
        response.setStatus(HttpServletResponse.SC_CREATED);
    }


}
