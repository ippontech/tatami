package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.User;

import java.util.Collection;

/**
 *This repository stores the the relationships blockingUser-blockedUser.
 * Similar strucure as the FriendRepository.
 */
public interface BlockRepository {

    void blockUser(String currentUserLogin, String blockedUserLogin);

    void unblockUser(String currentUserLogin, String unblockedUserLogin);

    Collection<String> getUsersBlockedBy(String userLogin);

    boolean isBlocked(String blockingLogin, String blockedLogin);
}
