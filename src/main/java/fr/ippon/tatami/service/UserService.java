package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.OpenId;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.*;
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

    @Inject
    private CounterRepository counterRepository;

    public User getUserByEmail(String email) {
        if (log.isDebugEnabled()) {
            log.debug("Looking for user with email : " + email);
        }
        return userRepository.findUserByEmail(email);
    }

    public User getUserProfileByEmail(String email) {
        User user = getUserByEmail(email);
        user.setTweetCount(counterRepository.getTweetCounter(email));
        user.setFollowersCount(counterRepository.getFollowersCounter(email));
        user.setFriendsCount(counterRepository.getFriendsCounter(email));
        return user;
    }

    public User getUserByOpenIdToken(String token) {
        OpenId openId = openIdRepository.findOpenIdByToken(token);
        if (openId == null) {
            return null;
        }
        return getUserByEmail(openId.getEmail());
    }

    public void createOrUpdateUser(User user) {
        User existingUser = userRepository.findUserByEmail(user.getEmail());
        if (existingUser == null) {
            counterRepository.createTweetCounter(user.getEmail());
            counterRepository.createFriendsCounter(user.getEmail());
            counterRepository.createFollowersCounter(user.getEmail());
        }
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
            counterRepository.incrementFriendsCounter(currentUser.getEmail());
            followerRepository.addFollower(followedUser.getEmail(), currentUser.getEmail());
            counterRepository.incrementFollowersCounter(followedUser.getEmail());
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
