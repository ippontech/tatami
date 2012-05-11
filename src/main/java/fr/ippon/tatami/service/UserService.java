package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.repository.FollowerRepository;
import fr.ippon.tatami.repository.FriendRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.util.GravatarUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

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

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private IndexService indexService;

    @Inject
    private boolean indexActivated;

    public User getUserByLogin(String login) {
        return userRepository.findUserByLogin(login);
    }

    /**
     * Return a collection of Users based on their login (ie : uid)
     *
     * @param logins the collection : must not be null
     * @return a Collection of User
     */
    public Collection<User> getUsersByLogin(final List<String> logins) {
        Assert.notNull(logins);

        final Collection<User> users = new ArrayList<User>(logins.size());
        for (String login : logins) {
            users.add(userRepository.findUserByLogin(login));
        }

        return users;
    }

    public User getUserProfileByLogin(String login) {
        User user = getUserByLogin(login);
        if (user != null) {
            user.setTweetCount(counterRepository.getTweetCounter(login));
            user.setFollowersCount(counterRepository.getFollowersCounter(login));
            user.setFriendsCount(counterRepository.getFriendsCounter(login));
        }
        return user;
    }

    public void updateUser(User user) {
        User currentUser = authenticationService.getCurrentUser();
        user.setLogin(currentUser.getLogin());
        user.setGravatar(GravatarUtil.getHash(user.getEmail()));
        try {
            userRepository.updateUser(user);
            // Add to Elastic Search index if it is activated
            if (indexActivated) {
                indexService.addUser(user);
            }
        } catch (ConstraintViolationException cve) {
            log.info("Constraint violated while updating user " + user);
        }

    }

    public void createUser(User user) {
        user.setGravatar(GravatarUtil.getHash(user.getEmail()));
        counterRepository.createTweetCounter(user.getLogin());
        counterRepository.createFriendsCounter(user.getLogin());
        counterRepository.createFollowersCounter(user.getLogin());
        userRepository.createUser(user);

        // Add to Elastic Search index if it is activated
        if (indexActivated) {
            indexService.addUser(user);
        }
    }

    public void followUser(String loginToFollow) {
        if (log.isDebugEnabled()) {
            log.debug("Adding friend : " + loginToFollow);
        }
        User currentUser = authenticationService.getCurrentUser();
        User followedUser = getUserByLogin(loginToFollow);
        if (followedUser != null && !followedUser.equals(currentUser)) {
            boolean userAlreadyFollowed = false;
            if (counterRepository.getFriendsCounter(currentUser.getLogin()) > 0) {
                for (String alreadyFollowingTest : friendRepository.findFriendsForUser(currentUser.getLogin())) {
                    if (alreadyFollowingTest.equals(loginToFollow)) {
                        userAlreadyFollowed = true;
                    }
                }
            }
            if (!userAlreadyFollowed) {
                friendRepository.addFriend(currentUser.getLogin(), followedUser.getLogin());
                counterRepository.incrementFriendsCounter(currentUser.getLogin());
                followerRepository.addFollower(followedUser.getLogin(), currentUser.getLogin());
                counterRepository.incrementFollowersCounter(followedUser.getLogin());
            }
        } else {
            log.debug("Followed user does not exist : " + loginToFollow);
        }
    }

    public void unfollowUser(String login) {
        if (log.isDebugEnabled()) {
            log.debug("Removing followed user : " + login);
        }
        User currentUser = authenticationService.getCurrentUser();
        User followedUser = getUserByLogin(login);
        if (followedUser != null) {
            boolean userAlreadyFollowed = false;
            for (String alreadyFollowingTest : friendRepository.findFriendsForUser(currentUser.getLogin())) {
                if (alreadyFollowingTest.equals(login)) {
                    userAlreadyFollowed = true;
                }
            }
            if (userAlreadyFollowed) {
                friendRepository.removeFriend(currentUser.getLogin(), followedUser.getLogin());
                counterRepository.decrementFriendsCounter(currentUser.getLogin());
                followerRepository.removeFollower(followedUser.getLogin(), currentUser.getLogin());
                counterRepository.decrementFollowersCounter(followedUser.getLogin());
            }
        } else {
            log.debug("Followed user does not exist : " + login);
        }
    }

    public Collection<String> getFriendIdsForUser(String login) {
        if (log.isDebugEnabled()) {
            log.debug("Retrieving followed users : " + login);
        }
        return friendRepository.findFriendsForUser(login);
    }

    public Collection<String> getFollowerIdsForUser(String login) {
        if (log.isDebugEnabled()) {
            log.debug("Retrieving followed users : " + login);
        }
        return followerRepository.findFollowersForUser(login);
    }

    public Collection<User> getFriendsForUser(String login) {
        Collection<String> friendLogins = friendRepository.findFriendsForUser(login);
        Collection<User> friends = new ArrayList<User>();
        for (String friendLogin : friendLogins) {
            User friend = userRepository.findUserByLogin(friendLogin);
            friends.add(friend);
        }
        return friends;
    }

    public Collection<User> getFollowersForUser(String login) {
        Collection<String> followersLogins = followerRepository.findFollowersForUser(login);
        Collection<User> followers = new ArrayList<User>();
        for (String followerLogin : followersLogins) {
            User follower = userRepository.findUserByLogin(followerLogin);
            followers.add(follower);
        }
        return followers;
    }

    public User getCurrentUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        org.springframework.security.core.userdetails.User springSecurityUser = (org.springframework.security.core.userdetails.User) securityContext
                .getAuthentication().getPrincipal();

        return getUserByLogin(springSecurityUser.getUsername());
    }

    public void setAuthenticationService(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    /**
     * Finds if the "userLogin" user is followed by the current user.
     */
    public boolean isFollowed(String userLogin) {
        if (log.isDebugEnabled()) {
            log.debug("Retrieving if you follow this user : " + userLogin);
        }
        boolean isFollowed = false;
        User user = getCurrentUser();
        if (null != user && !userLogin.equals(user.getLogin())) {
            Collection<String> users = getFollowerIdsForUser(userLogin);
            if (null != users && users.size() > 0) {
                for (String follower : users) {
                    if (follower.equals(user.getLogin())) {
                        isFollowed = true;
                        break;
                    }
                }
            }
        }
        return isFollowed;
    }
}
