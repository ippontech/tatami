package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.BlockRepository;
import fr.ippon.tatami.repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

/**
 * Created by matthieudelafourniere on 7/5/16.
 */

@Service
public class BlockService {

    @Inject
    private BlockRepository blockRepository;

    @Inject
    private UserRepository userRepository;

    public void blockUser(String currentEmail, String blockedEmail){
        blockRepository.blockUser(currentEmail, blockedEmail);
    }

    public void unblockUser(String currentEmail, String unblockedEmail){
        blockRepository.unblockUser(currentEmail, unblockedEmail);
    }

    public Collection<String> getUsersBlockedEmailForUser(String email){
        return blockRepository.getUsersBlockedBy(email);
    }

    public Collection<User> getUsersBlockedForUser(String email){
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
