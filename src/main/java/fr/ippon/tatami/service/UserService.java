package fr.ippon.tatami.service;

import java.net.URL;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.repository.FollowerRepository;
import fr.ippon.tatami.repository.FriendRepository;
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
    private FollowerRepository followerRepository;

    @Inject
    private FriendRepository friendRepository;

    @Inject
    private CounterRepository counterRepository;

    public User getUserByLogin(String login) {
        if (log.isDebugEnabled()) {
            log.debug("Looking for user with login : " + login);
        }
        return userRepository.findUserByLogin(login);
    }

    public User getUserProfileByLogin(String login) {
        User user = getUserByLogin(login);
        user.setTweetCount(counterRepository.getTweetCounter(login));
        user.setFollowersCount(counterRepository.getFollowersCounter(login));
        user.setFriendsCount(counterRepository.getFriendsCounter(login));
        return user;
    }

    public void setUserProfileByLogin(String login, URL picture, String firstName, String lastName) {
        User user = getUserByLogin(login);
//        user.setPicture(picture); TODO
        user.setFirstName(firstName);
        user.setLastName(lastName);
        userRepository.updateUser(user);
    }

    public void createUser(User user) {
        counterRepository.createTweetCounter(user.getLogin());
        counterRepository.createFriendsCounter(user.getLogin());
        counterRepository.createFollowersCounter(user.getLogin());
        userRepository.createUser(user);
    }

    public void followUser(String login) {
        if (log.isDebugEnabled()) {
            log.debug("Adding follower : " + login);
        }
        User currentUser = getCurrentUser();
        User followedUser = getUserByLogin(login);
        if (followedUser != null) {
            friendRepository.addFriend(currentUser.getLogin(), followedUser.getLogin());
            counterRepository.incrementFriendsCounter(currentUser.getLogin());
            followerRepository.addFollower(followedUser.getLogin(), currentUser.getLogin());
            counterRepository.incrementFollowersCounter(followedUser.getLogin());
        } else {
            log.debug("Followed user does not exist : " + login);
        }
    }

    public User getCurrentUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        org.springframework.security.core.userdetails.User springSecurityUser = (org.springframework.security.core.userdetails.User) securityContext
                .getAuthentication().getPrincipal();

        return getUserByLogin(springSecurityUser.getUsername());
    }
}
