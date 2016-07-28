package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.BlockRepository;
import fr.ippon.tatami.repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Created by matthieudelafourniere on 7/5/16.
 */

@Service
public class BlockService {

    @Inject
    private BlockRepository blockRepository;

    @Inject
    private UserRepository userRepository;

    public void blockUser(String currentEmail, String blockedEmail) {
        blockRepository.blockUser(currentEmail, blockedEmail);
    }

    public void unblockUser(String currentEmail, String unblockedEmail) {
        blockRepository.unblockUser(currentEmail, unblockedEmail);
    }

    public Collection<String> getUsersBlockedEmailForUser(String email) {
        return blockRepository.getUsersBlockedBy(email);
    }

    public List<User> getUsersBlockedForUser(String userEmail) {
        return getUsersBlockedEmailForUser(userEmail).stream()
            .map(email -> userRepository.findOneByEmail(email))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());
    }

    public boolean isBlocked(String blockerEmail, String blockedEmail) {
        return blockRepository.isBlocked(blockerEmail, blockedEmail);
    }
}
