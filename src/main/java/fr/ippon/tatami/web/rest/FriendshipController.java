package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Timed;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.FriendshipService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.dto.UserDTO;
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

    @RequestMapping(value = "/rest/users/{username}",
            method = RequestMethod.PATCH)
    @Timed
    @ResponseBody
    public UserDTO updateFriend(@RequestBody UserDTO user, @PathVariable String username) {
        if (user.isFriend()) {
            friendshipService.followUser(username);
        } else {
            friendshipService.unfollowUser(username);
        }
        return userService.buildUserDTO(userService.getUserByUsername(username));
    }
}
