package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Timed;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.*;
import fr.ippon.tatami.service.dto.UserDTO;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.EmailAndUsername;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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

    private final Log log = LogFactory.getLog(FriendshipController.class);

    @Inject
    private FriendshipService friendshipService;

    @Inject
    private UserService userService;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private MailService mailService;

    /**
     * POST /friendships/create -> follow user
     */
    @RequestMapping(value = "/rest/friendships/create",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    @Timed
    public void followUser(@RequestBody User user, HttpServletResponse response) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to follow username : " + user.getUsername());
        }
        User followedUser = friendshipService.followUser(user.getUsername());
        if (followedUser == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    /**
     * GET /friendships -> follow user
     */
    @RequestMapping(value = "/rest/friendships",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Boolean followUser(@RequestParam("screen_name") String username) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get friendship status : " + username);
        }
        return friendshipService.isFollowing(username);
    }

    /**
     * POST /friendships/destroy -> unfollow user
     */
    @RequestMapping(value = "/rest/friendships/destroy",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    @Timed
    public void unfollowUser(@RequestBody User user) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to unfollow username  : " + user.getUsername());
        }
        friendshipService.unfollowUser(user.getUsername());
    }

    /**
     * GET  /friends/lookup -> return extended data about the user's friends
     */
    @RequestMapping(value = "/rest/friends/lookup",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<User> getFriends(@RequestParam("screen_name") String username) {

        return friendshipService.getFriendsForUser(username);
    }

    /**
     * GET  /followers/lookup -> return extended data about the user's followers
     */
    @RequestMapping(value = "/rest/followers/lookup",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<User> getFollowers(@RequestParam("screen_name") String username) {
        return friendshipService.getFollowersForUser(username);
    }

    /**
     * POST /friendships -> follow user
     */
    @RequestMapping(value = "/rest/friendships",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    @Timed
    public void followUserByEmailAndUsername(HttpServletResponse response, @RequestBody EmailAndUsername emailAndUsername) {
        if (StringUtils.isNotEmpty(emailAndUsername.getUsername())) {
            if (log.isDebugEnabled()) {
                log.debug("REST request to follow username : " + emailAndUsername.getUsername());
            }
            friendshipService.followUser(emailAndUsername.getUsername());
        } else if (StringUtils.isNotEmpty(emailAndUsername.getEmail())) {
            if (log.isDebugEnabled()) {
                log.debug("REST request to follow email : " + emailAndUsername.getEmail());
            }
            User user = userService.getUserByLogin(emailAndUsername.getEmail());
            if (user != null) {
                friendshipService.followUser(user.getUsername());
            } else {
                User currentUser = authenticationService.getCurrentUser();
                if (DomainUtil.getDomainFromLogin(emailAndUsername.getEmail()).equalsIgnoreCase(currentUser.getDomain())) {
                    mailService.sendInvitationEmail(emailAndUsername.getEmail(), currentUser);
                } else {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                }
            }
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    /**
     * POST /friendships/check -> check username or email
     */
    @RequestMapping(value = "/rest/friendships/check",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    @Timed
    public void checkFriend(HttpServletResponse response, @RequestBody EmailAndUsername emailAndUsername) {
        User user;
        if (StringUtils.isNotEmpty(emailAndUsername.getUsername())) {
            if (log.isDebugEnabled()) {
                log.debug("REST request to check username : " + emailAndUsername.getUsername());
            }
            user = userService.getUserByUsername(emailAndUsername.getUsername());
        } else if (StringUtils.isNotEmpty(emailAndUsername.getEmail())) {
            if (log.isDebugEnabled()) {
                log.debug("REST request to check email : " + emailAndUsername.getEmail());
            }
            user = userService.getUserByLogin(emailAndUsername.getEmail());
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        User currentUser = authenticationService.getCurrentUser();
        if (user != null && !user.getDomain().equalsIgnoreCase(currentUser.getDomain())
                || user == null && !DomainUtil.getDomainFromLogin(emailAndUsername.getEmail()).equalsIgnoreCase(currentUser.getDomain())) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }
        return;
    }

    @RequestMapping(value = "/rest/users/{username}/friends",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    @ResponseBody
    public Collection<UserDTO> getFriendsV3(@PathVariable String username, HttpServletResponse response) {
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
    public Collection<UserDTO> getFollowersV3(@PathVariable String username, HttpServletResponse response) {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
        Collection<User> friends = friendshipService.getFollowersForUser(username);

        return userService.buildUserDTOList(friends);
    }

    @RequestMapping(value = "/rest/users/{username}",
            method = RequestMethod.PATCH)
    @Timed
    @ResponseBody
    public UserDTO updateFriendV3(@RequestBody UserDTO user, @PathVariable String username){
        if (user.isFriend()) {
            friendshipService.followUser(username);
        } else {
            friendshipService.unfollowUser(username);
        }
        return userService.buildUserDTO(userService.getUserByUsername(username));
    }
}
