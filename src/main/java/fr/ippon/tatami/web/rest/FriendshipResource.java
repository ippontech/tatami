package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.FriendshipService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.UserDTO;
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
@RequestMapping("/tatami")
public class FriendshipResource {

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    @Inject
    private FriendshipService friendshipService;

    @Inject
    private UserService userService;

    @Inject
    private UserRepository userRepository;

    @RequestMapping(value = "/rest/users/{email}/friends",
        method = RequestMethod.GET,
        produces = "application/json")
    @Timed
    @ResponseBody
    public Collection<UserDTO> getFriends(@PathVariable String email, HttpServletResponse response) {
        /*
                In cases of posts where users are mentioned, we pass in a username instead of an email address when
                a user clicks the link. In these cases, we should append the current user's domain to the username
                before we proceed.

                See marked.js
        */
        if (!DomainUtil.isValidEmailAddress(email)) {
            email = DomainUtil.getEmailFromUsernameAndDomain(email, SecurityUtils.getCurrentUserDomain());
        }
        User user = userRepository.findOneByEmail(email).get();
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
        Collection<User> friends = friendshipService.getFriendsForUser(user.getUsername());

        return userService.buildUserDTOList(friends);
    }

    @RequestMapping(value = "/rest/users/{email}/followers",
        method = RequestMethod.GET,
        produces = "application/json")
    @Timed
    @ResponseBody
    public Collection<UserDTO> getFollowers(@PathVariable String email, HttpServletResponse response) {
        /*
                In cases of posts where users are mentioned, we pass in a username instead of an email address when
                a user clicks the link. In these cases, we should append the current user's domain to the username
                before we proceed.

                See marked.js
        */
        if (!DomainUtil.isValidEmailAddress(email)) {
            email = DomainUtil.getEmailFromUsernameAndDomain(email, SecurityUtils.getCurrentUserDomain());
        }
        User user = userRepository.findOneByEmail(email).get();
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
        Collection<User> friends = friendshipService.getFollowersForUser(user.getUsername());

        return userService.buildUserDTOList(friends);
    }

    /**
     * Added an "action" parameter to specify which type of PATCH we should do (Activate / Follow ).
     */

    @RequestMapping(value = "/rest/users/{email}",
        method = RequestMethod.PATCH)
    @Timed
    @ResponseBody
    public UserDTO updateFriend(@PathVariable("email") String email) {
        UserDTO toReturn = userService.buildUserDTO(userRepository.findOneByEmail(email).get());
        if (!toReturn.isFriend()) {
            friendshipService.followUser(toReturn.getEmail());
        } else {
            friendshipService.unfollowUser(toReturn.getEmail());
        }
        return toReturn;
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
