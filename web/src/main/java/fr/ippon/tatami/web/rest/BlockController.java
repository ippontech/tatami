package fr.ippon.tatami.web.rest;

/**
 * Created by matthieudelafourniere on 7/7/16.
 */


import com.yammer.metrics.annotation.Timed;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.BlockService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.util.Collection;

/**
 * REST controller for blocking/unblocking users.
 */
@Controller
public class BlockController {
    private final Logger log = LoggerFactory.getLogger(BlockController.class);

    @Inject
    private BlockService blockService;

    @Inject
    UserService userService;

    @Inject
    UserRepository userRepository;

    @Inject
    private AuthenticationService authenticationService;


    @RequestMapping(value = "/rest/block/blockedusers/{username}",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    @ResponseBody
    public Collection<UserDTO> getBlockedUsersForUser(@PathVariable String username, HttpServletResponse response) {

        User currentUser = authenticationService.getCurrentUser();
        if (currentUser == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
        String login = username + "@" + currentUser.getDomain();

        Collection<User> blockedUsers = blockService.getUsersBlockedForUser(login);

        return userService.buildUserDTOList(blockedUsers);
    }


    /**
     * Method used by current user. Switch the blocked/unblocked status of the clicked user.
     * @param username (of the clicked user)
     * @return
     */
    @RequestMapping(value = "/rest/block/update/{username}",
            method = RequestMethod.PATCH)
    @Timed
    @ResponseBody
    public UserDTO updateBlockedUser(@PathVariable("username") String username) {
        User currentUser = authenticationService.getCurrentUser();
        String login = username + "@" + currentUser.getDomain();
        UserDTO toReturn = userService.buildUserDTO(userRepository.findUserByLogin(login));
        if(  blockService.isBlocked(currentUser.getLogin(),toReturn.getLogin())  ) {
            blockService.unblockUser(currentUser.getLogin(), toReturn.getLogin());
        }
        else {
            blockService.blockUser(currentUser.getLogin(), toReturn.getLogin());
        }
        return toReturn;
    }
}
