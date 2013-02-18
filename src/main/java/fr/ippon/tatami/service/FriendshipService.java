package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.repository.FollowerRepository;
import fr.ippon.tatami.repository.FriendRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Manages the user's frienships.
 * <p/>
 * - A friend is someone you follow
 * - A follower is someone that follows you
 *
 * @author Julien Dubois
 */
@Service
public class FriendshipService {

    private final Log log = LogFactory.getLog(FriendshipService.class);

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

    public User followUser(String usernameToFollow) {
        if (log.isDebugEnabled()) {
            log.debug("Following user : " + usernameToFollow);
        }
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        String loginToFollow = DomainUtil.getLoginFromUsernameAndDomain(usernameToFollow, domain);
        User followedUser = userRepository.findUserByLogin(loginToFollow);
        if (followedUser != null && !followedUser.equals(currentUser)) {
            boolean userAlreadyFollowed = false;
            if (counterRepository.getFriendsCounter(currentUser.getLogin()) > 0) {
                for (String alreadyFollowingTest : friendRepository.findFriendsForUser(currentUser.getLogin())) {
                    if (alreadyFollowingTest.equals(loginToFollow)) {
                        userAlreadyFollowed = true;
                        if (log.isDebugEnabled()) {
                            log.debug("User " + currentUser.getLogin() +
                                    " already follows user " + followedUser.getLogin());
                        }
                        break;
                    }
                }
            }
            if (!userAlreadyFollowed) {
                friendRepository.addFriend(currentUser.getLogin(), followedUser.getLogin());
                counterRepository.incrementFriendsCounter(currentUser.getLogin());
                followerRepository.addFollower(followedUser.getLogin(), currentUser.getLogin());
                counterRepository.incrementFollowersCounter(followedUser.getLogin());
                if (log.isDebugEnabled()) {
                    log.debug("User " + currentUser.getLogin() +
                            " now follows user " + followedUser.getLogin());
                }
            }
            return followedUser;
        } else {
            log.debug("Followed user does not exist : " + loginToFollow);
            return null;
        }
    }

    public void unfollowUser(String usernameToUnfollow) {
        if (log.isDebugEnabled()) {
            log.debug("Removing followed user : " + usernameToUnfollow);
        }
        User currentUser = authenticationService.getCurrentUser();
        String loginToUnfollow = this.getLoginFromUsername(usernameToUnfollow);
        User userToUnfollow = userRepository.findUserByLogin(loginToUnfollow);
        unfollowUser(currentUser, userToUnfollow);
    }

    public void unfollowUser(User currentUser, User userToUnfollow) {
        if (userToUnfollow != null) {
            String loginToUnfollow = userToUnfollow.getLogin();
            boolean userAlreadyFollowed = false;
            for (String alreadyFollowingTest : friendRepository.findFriendsForUser(currentUser.getLogin())) {
                if (alreadyFollowingTest.equals(loginToUnfollow)) {
                    userAlreadyFollowed = true;
                }
            }
            if (userAlreadyFollowed) {
                friendRepository.removeFriend(currentUser.getLogin(), loginToUnfollow);
                counterRepository.decrementFriendsCounter(currentUser.getLogin());
                followerRepository.removeFollower(loginToUnfollow, currentUser.getLogin());
                counterRepository.decrementFollowersCounter(loginToUnfollow);
                log.debug("User " + currentUser.getLogin() +
                        " has stopped following user " + loginToUnfollow);
            }
        } else {
            log.debug("Followed user does not exist.");
        }
    }

    public List<String> getFriendIdsForUser(String login) {
        if (log.isDebugEnabled()) {
            log.debug("Retrieving friends for user : " + login);
        }
        return friendRepository.findFriendsForUser(login);
    }

    public Collection<String> getFollowerIdsForUser(String login) {
        if (log.isDebugEnabled()) {
            log.debug("Retrieving followed users : " + login);
        }
        return followerRepository.findFollowersForUser(login);
    }

    public Collection<User> getFriendsForUser(String username) {
        String login = this.getLoginFromUsername(username);
        Collection<String> friendLogins = friendRepository.findFriendsForUser(login);
        Collection<User> friends = new ArrayList<User>();
        for (String friendLogin : friendLogins) {
            User friend = userRepository.findUserByLogin(friendLogin);
            friends.add(friend);
        }
        return friends;
    }

    public Collection<User> getFollowersForUser(String username) {
        String login = this.getLoginFromUsername(username);
        Collection<String> followersLogins = followerRepository.findFollowersForUser(login);
        Collection<User> followers = new ArrayList<User>();
        for (String followerLogin : followersLogins) {
            User follower = userRepository.findUserByLogin(followerLogin);
            followers.add(follower);
        }
        return followers;
    }

    /**
     * Finds if the "userLogin" user is followed by the current user.
     */
    public boolean isFollowed(String userLogin) {
        if (log.isDebugEnabled()) {
            log.debug("Retrieving if you follow this user : " + userLogin);
        }
        boolean isFollowed = false;
        User user = authenticationService.getCurrentUser();
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

    /**
     * Finds if  the current user user follow the "userLogin".
     */
    public boolean isFollowing(String userLogin) {
        if (log.isDebugEnabled()) {
            log.debug("Retrieving if you follow this user : " + userLogin);
        }
        boolean isFollowing = false;
        User user = authenticationService.getCurrentUser();
        if (null != user && !userLogin.equals(user.getLogin())) {
            Collection<User> users = getFriendsForUser(user.getUsername());
            if (null != users && users.size() > 0) {
                for (User follower : users) {
                    if (follower.getUsername().equals(userLogin)) {
                        isFollowing = true;
                        break;
                    }
                }
            }
        }
        return isFollowing;
    }

    private String getLoginFromUsername(String username) {
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        return DomainUtil.getLoginFromUsernameAndDomain(username, domain);
    }

    public void setAuthenticationService(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }
}
