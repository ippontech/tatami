package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.FriendshipService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.Collection;

/**
 * REST controller for managing frienships.
 *
 * @author Julien Dubois
 */
@Controller
public class FriendshipController {

    private final Log log = LogFactory.getLog(FriendshipController.class);

    @Inject
    private FriendshipService friendshipService;

    /**
     * POST /friendships/create -> follow user
     */
    @RequestMapping(value = "/rest/friendships/create",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    public void followUser(@RequestBody User user) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to follow username : " + user.getUsername());
        }
        friendshipService.followUser(user.getUsername());
    }

    /**
     * POST /friendships/destroy -> unfollow user
     */
    @RequestMapping(value = "/rest/friendships/destroy",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
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
    public Collection<User> getFollowers(@RequestParam("screen_name") String username) {
        return friendshipService.getFollowersForUser(username);
    }
}
