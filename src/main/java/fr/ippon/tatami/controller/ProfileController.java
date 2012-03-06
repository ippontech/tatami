package fr.ippon.tatami.controller;

import fr.ippon.tatami.controller.bean.Profile;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;

/**
 * Profile REST controller.
 *
 * @author Julien Dubois
 */
@Controller
public class ProfileController {

    private final Log log = LogFactory.getLog(ProfileController.class);

    @Inject
    private UserService userService;

    @RequestMapping(value = "/rest/profiles/{email}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Profile getProfile(@PathVariable("email") String email) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get Profile : " + email);
        }
        Profile profile = new Profile();
        User user = userService.getUserByEmail(email);
        profile.setEmail(user.getEmail());
        profile.setFirstName(user.getFirstName());
        profile.setLastName(user.getLastName());

        return profile;
    }

    @RequestMapping(value = "/rest/profiles/{email}/addFriend",
            method = RequestMethod.POST,
            consumes = "application/json",
            produces = "application/json")
    public void addFriend(@PathVariable("email") String email, @RequestBody String friend) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to add friend : " + friend);
        }
        User currentUser = userService.getCurrentUser();
        if (currentUser.getEmail().equals(email)) {
            userService.followUser(friend);
        } else {
            log.info("Cannot add a friend to another user");
        }
    }
}
