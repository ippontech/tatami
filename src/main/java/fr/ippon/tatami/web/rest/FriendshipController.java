package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Timed;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.FriendshipService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.util.Collection;

/**
 * REST controller for managing friendships.
 *
 * @author Julien Dubois
 */
@Controller
public class FriendshipController {

    private final Logger log = LoggerFactory.getLogger(UserController.class);

    @Inject
    private FriendshipService friendshipService;

    @Inject
    private UserService userService;

    @RequestMapping(value = "/rest/users/{username}/friends",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    @ResponseBody
    public Collection<UserDTO> getFriends(@PathVariable String username, HttpServletResponse response) {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
        Collection<User> friends = friendshipService.getFriendsForUser(username);

        return userService.buildUserDTOList(friends);
    }

    @RequestMapping(value = "/rest/users/{username}/followers",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    @ResponseBody
    public Collection<UserDTO> getFollowers(@PathVariable String username, HttpServletResponse response) {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
        Collection<User> friends = friendshipService.getFollowersForUser(username);

        return userService.buildUserDTOList(friends);
    }

    /**
     * Added an "action" parameter to specify which type of PATCH we should do (Activate / Follow ).
     */
    @RequestMapping(value = "/rest/users/{username}",
            method = RequestMethod.PATCH)
    @Timed
    @ResponseBody
    public UserDTO updateFriend(@RequestBody fr.ippon.tatami.web.rest.dto.UserActionStatus action, @PathVariable("username") String username) {
        if ( action.getFriendShip() != null && action.getFriendShip() ) {
            if ( action.getFriend() ) {
                friendshipService.followUser(username);
            } else {
                friendshipService.unfollowUser(username);
            }
        }
        else if ( action.getActivate() != null &&  action.getActivate()) {
            this.log.debug("REST request to desactivate Profile : {}", username);
            userService.desactivateUser(username);
        }
        return userService.buildUserDTO(userService.getUserByUsername(username));
    }

    /**
     * WARNING! This is the old API, only used by the admin console
     * <p/>
     * POST /friendships/create -> follow user
     */
    @RequestMapping(value = "/rest/friendships/create",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    @Timed
    @Deprecated
    public boolean followUser(@RequestBody User user, HttpServletResponse response) {
        log.debug("REST request to follow username : {}", user.getUsername());
        boolean success = friendshipService.followUser(user.getUsername());
        if (!success) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
        return success;
    }


    /**
     * WARNING! This is the old API, only used by the admin console
     * <p/>
     * POST /friendships/destroy -> unfollow user
     */
    @RequestMapping(value = "/rest/friendships/destroy",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    @Timed
    @Deprecated
    public boolean unfollowUser(@RequestBody User user, HttpServletResponse response) {
        log.debug("REST request to unfollow username  : {}", user.getUsername());
        boolean success = friendshipService.unfollowUser(user.getUsername());
        if (!success) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
        return success;
    }

    /**
     * WARNING! This is the old API, only used by the admin console
     * <p/>
     * GET /friendships -> is the user a friend ?
     */
    @RequestMapping(value = "/rest/friendships",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    @Deprecated
    public Boolean followUser(@RequestParam("screen_name") String username) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get friendship status : " + username);
        }
        return friendshipService.isFollowing(username);
    }
}
