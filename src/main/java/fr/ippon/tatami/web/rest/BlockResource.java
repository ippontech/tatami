package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.BlockService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.web.rest.dto.UserDTO;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.Collection;

/**
 * REST controller for blocking/unblocking users.
 */
@RestController
@RequestMapping("/tatami")
public class BlockResource {

    @Inject
    private BlockService blockService;

    @Inject
    private UserService userService;

    @Inject
    private UserRepository userRepository;

    @RequestMapping(value = "/rest/block/blockedusers/{email}",
        method = RequestMethod.GET,
        produces = "application/json")
    @Timed
    @ResponseBody
    public Collection<UserDTO> getBlockedUsersForUser(@PathVariable String email) {
        Collection<User> blockedUsers = blockService.getUsersBlockedForUser(email);
        return userService.buildUserDTOList(blockedUsers);
    }

    /**
     * Method used by current user. Switch the blocked/unblocked status of the clicked user.
     *
     * @param email (of the clicked user)
     * @return
     */
    @RequestMapping(value = "/rest/block/update/{email}",
        method = RequestMethod.PATCH)
    @Timed
    @ResponseBody
    public UserDTO updateBlockedUser(@PathVariable("email") String email) {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        UserDTO toReturn = userService.buildUserDTO(userRepository.findOneByEmail(email).get());
        if (toReturn.isBlocked()) {
            blockService.unblockUser(currentUserEmail, toReturn.getEmail());
        } else {
            blockService.blockUser(currentUserEmail, toReturn.getEmail());
        }
        return toReturn;
    }

}
