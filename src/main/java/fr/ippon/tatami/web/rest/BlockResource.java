package fr.ippon.tatami.web.rest;

/**
 * Created by matthieudelafourniere on 7/6/16.
 */

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.UserDetailsService;
import fr.ippon.tatami.service.BlockService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.Collection;

/**
 * REST controller for blocking/unblocking users.
 */
@RestController
@RequestMapping("/tatami")
public class BlockResource {

    private final Logger log = LoggerFactory.getLogger(BlockResource.class);

    @Inject
    private BlockService blockService;

    @Inject
    UserService userService;

    @Inject
    UserRepository userRepository;

    @Inject
    UserDetailsService userDetailsService;


    @RequestMapping(value = "/rest/block/blockedusers/{username}",
        method = RequestMethod.GET,
        produces = "application/json")
    @Timed
    @ResponseBody
    public Collection<UserDTO> getBlockedUsersForUser(@PathVariable String username) {

        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        String email = username + "@" + currentUser.getDomain();

        Collection<User> blockedUsers = blockService.getUsersBlockedForUser(email);

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
        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        String email = username + "@" + currentUser.getDomain();
        UserDTO toReturn = userService.buildUserDTO(userRepository.findOneByEmail(email).get());
        if(  blockService.isBlocked(currentUser.getEmail(),toReturn.getEmail())  ) {
            blockService.unblockUser(currentUser.getEmail(), toReturn.getEmail());
        }
        else {
            blockService.blockUser(currentUser.getEmail(), toReturn.getEmail());
        }
        return toReturn;
    }


}
