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
import java.util.Optional;

@Service
public class BlockService {

    private final Logger log = LoggerFactory.getLogger(BlockService.class);


    @Inject
    private BlockRepository blockRepository;

    @Inject
    private UserRepository userRepository;

    public void blockUser(String currentEmail, String blockedEmail){
        log.debug(currentEmail + " is blocking " + blockedEmail);
        blockRepository.blockUser(currentEmail, blockedEmail);
    }

    public void unblockUser(String currentEmail, String unblockedEmail){
        log.debug(currentEmail + " is unblocking " + unblockedEmail);
        blockRepository.unblockUser(currentEmail, unblockedEmail);
    }

    public Collection<String> getUsersBlockedEmailForUser(String email){
        return blockRepository.getUsersBlockedBy(email);
    }

    public Collection<User> getUsersBlockedForUser(String email){
        log.debug("Getting users blocked by {}", email);
        Collection<String> blockedUsersEmails = getUsersBlockedEmailForUser(email);
        Collection<User> blockedUsers = new ArrayList<User>();
        for (String blockedEmail : blockedUsersEmails) {
            Optional<User> optionalUser = userRepository.findOneByEmail(blockedEmail);
            if(optionalUser.isPresent()){
                User user = optionalUser.get();
                blockedUsers.add(user);
            }
        }
        return blockedUsers;
    }

    public boolean isBlocked(String blockerEmail, String blockedEmail){
        return blockRepository.isBlocked(blockerEmail, blockedEmail);
    }
}
