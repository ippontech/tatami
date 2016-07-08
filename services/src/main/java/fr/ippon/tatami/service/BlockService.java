package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.BlockRepository;
import fr.ippon.tatami.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;

/**
 * Created by matthieudelafourniere on 7/7/16.
 */
@Service
public class BlockService {

    private final Logger log = LoggerFactory.getLogger(BlockService.class);

    @Inject
    private BlockRepository blockRepository;

    @Inject
    private UserRepository userRepository;

    public void blockUser(String currentLogin, String blockedLogin){
        log.debug(currentLogin + " is blocking" + blockedLogin);
        blockRepository.blockUser(currentLogin, blockedLogin);
    }

    public void unblockUser(String currentLogin, String unblockedLogin){
        log.debug(currentLogin + "is unblocking" + unblockedLogin);
        blockRepository.unblockUser(currentLogin, unblockedLogin);
    }

    public Collection<String> getUsersBlockedLoginForUser(String login){
        return blockRepository.getUsersBlockedBy(login);
    }

    public Collection<User> getUsersBlockedForUser(String login){
        Collection<String> blockedUsersLogins = getUsersBlockedLoginForUser(login);
        Collection<User> blockedUsers = new ArrayList<User>();
        for (String blockedLogin : blockedUsersLogins) {
            User user = userRepository.findUserByLogin(blockedLogin);
            if(user != null){
                blockedUsers.add(user);
            }
        }
        log.debug("Getting users blocked by " + login, blockedUsers);
        return blockedUsers;
    }

    public boolean isBlocked(String blockerLogin, String blockedLogin){
        return blockRepository.isBlocked(blockerLogin, blockedLogin);
    }
}