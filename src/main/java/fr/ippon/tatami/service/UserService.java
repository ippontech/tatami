package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.OpenId;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.FollowerRepository;
import fr.ippon.tatami.repository.FriendRepository;
import fr.ippon.tatami.repository.OpenIdRepository;
import fr.ippon.tatami.repository.UserRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 * Manages the application's users.
 *
 * @author Julien Dubois
 */
@Service
public class UserService {

    private final Log log = LogFactory.getLog(UserService.class);

    @Inject
    private UserRepository userRepository;

    @Inject
    private OpenIdRepository openIdRepository;

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private FriendRepository friendRepository;

    public User getUserByEmail(String email) {
        if (log.isDebugEnabled()) {
            log.debug("Looking for user with email : " + email);
        }
        return userRepository.findUserByEmail(email);
    }

    public User getUserByOpenIdToken(String token) {
        OpenId openId = openIdRepository.findOpenIdByToken(token);
        if (openId == null) {
            return null;
        }
        return getUserByEmail(openId.getEmail());
    }

    public void createOrUpdateUser(User user) {
        userRepository.createUser(user);
        OpenId openId = new OpenId();
        openId.setToken(user.getOpenIdToken());
        openId.setEmail(user.getEmail());
        openIdRepository.createOpenId(openId);
    }

    public void followUser(String email) {
        if (log.isDebugEnabled()) {
            log.debug("Adding follower : " + email);
        }
        User currentUser = getCurrentUser();
        User followedUser = getUserByEmail(email);
        if (followedUser != null) {
            friendRepository.addFriend(currentUser.getEmail(), followedUser.getEmail());
            followerRepository.addFollower(followedUser.getEmail(), currentUser.getEmail());
        } else {
            log.debug("Followed user does not exist : " + email);
        }
    }

    public User getCurrentUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        org.springframework.security.core.userdetails.User springSecurityUser = (org.springframework.security.core.userdetails.User) securityContext
                .getAuthentication().getPrincipal();

        return getUserByEmail(springSecurityUser.getUsername());
    }
}
