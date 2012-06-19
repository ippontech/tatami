package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.service.util.GravatarUtil;
import fr.ippon.tatami.service.util.PasswordUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.inject.Inject;
import javax.inject.Named;
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
    private DomainRepository domainRepository;

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private FriendRepository friendRepository;

    @Inject
    private CounterRepository counterRepository;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private MailService mailService;

    @Inject
    private IndexService indexService;

    @Inject
    @Named("indexActivated")
    private boolean indexActivated;

    public User getUserByLogin(String login) {
        User user = userRepository.findUserByLogin(login);
        if (log.isDebugEnabled()) {
            log.debug("Found user : " + user);
        }
        return user;
    }

    /**
     * Return a collection of Users based on their username (ie : uid)
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

    public User getUserProfileByUsername(String username) {
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        String login = DomainUtil.getLoginFromUsernameAndDomain(username, domain);
        User user = getUserByLogin(login);
        if (user != null) {
            user.setStatusCount(counterRepository.getStatusCounter(login));
            user.setFollowersCount(counterRepository.getFollowersCounter(login));
            user.setFriendsCount(counterRepository.getFriendsCounter(login));
        }
        return user;
    }

    public void updateUser(User user) {
        User currentUser = authenticationService.getCurrentUser();
        user.setLogin(currentUser.getLogin());
        user.setUsername(currentUser.getUsername());
        user.setDomain(currentUser.getDomain());
        user.setGravatar(GravatarUtil.getHash(user.getLogin()));
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
        user.setLogin(user.getLogin().toLowerCase());
        String login = user.getLogin();
        String username = DomainUtil.getUsernameFromLogin(login);
        String domain = DomainUtil.getDomainFromLogin(login);

        domainRepository.addUserInDomain(domain, login);

        user.setPassword(PasswordUtil.generatePassword());
        user.setGravatar(GravatarUtil.getHash(login));
        user.setUsername(username);
        user.setDomain(domain);
        user.setFirstName("");
        user.setLastName("");

        counterRepository.createStatusCounter(user.getLogin());
        counterRepository.createFriendsCounter(user.getLogin());
        counterRepository.createFollowersCounter(user.getLogin());
        userRepository.createUser(user);

        // Add to Elastic Search index if it is activated
        if (indexActivated) {
            indexService.addUser(user);
        }

        if (log.isDebugEnabled()) {
            log.debug("Created User : " + user.toString());
        }
    }

    /**
     * Creates a User and sends a registration e-mail.
     */
    public void registerUser(User user) {
        this.createUser(user);
        mailService.sendRegistrationEmail(user);
    }

    public void followUser(String usernameToFollow) {
        if (log.isDebugEnabled()) {
            log.debug("Adding friend : " + usernameToFollow);
        }
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        String loginToFollow = DomainUtil.getLoginFromUsernameAndDomain(usernameToFollow, domain);
        User followedUser = getUserByLogin(loginToFollow);
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
                    }
                }
            }
            if (!userAlreadyFollowed) {
                friendRepository.addFriend(currentUser.getLogin(), followedUser.getLogin());
                counterRepository.incrementFriendsCounter(currentUser.getLogin());
                followerRepository.addFollower(followedUser.getLogin(), currentUser.getLogin());
                counterRepository.incrementFollowersCounter(followedUser.getLogin());
                log.debug("User " + currentUser.getLogin() +
                        " now follows user " + followedUser.getLogin());
            }
        } else {
            log.debug("Followed user does not exist : " + loginToFollow);
        }
    }

    public void unfollowUser(String usernameToUnfollow) {
        if (log.isDebugEnabled()) {
            log.debug("Removing followed user : " + usernameToUnfollow);
        }
        User currentUser = authenticationService.getCurrentUser();
        String loginToUnfollow = this.getLoginFromUsername(usernameToUnfollow);
        User userToUnfollow = getUserByLogin(loginToUnfollow);
        if (userToUnfollow != null) {
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
            log.debug("Followed user does not exist : " + loginToUnfollow);
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

    private String getLoginFromUsername(String username) {
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        return DomainUtil.getLoginFromUsernameAndDomain(username, domain);
    }
}
