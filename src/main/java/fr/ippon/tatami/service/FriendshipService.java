package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.status.MentionFriend;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.util.DomainUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private final Logger log = LoggerFactory.getLogger(FriendshipService.class);

    @Inject
    private UserRepository userRepository;

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private FriendRepository friendRepository;

    @Inject
    private CounterRepository counterRepository;

    @Inject
    private StatusRepository statusRepository;

    @Inject
    private MentionlineRepository mentionlineRepository;

    /**
     * Follow a user.
     *
     * @return true if the operation succeeds, false otherwise
     */
    public boolean followUser(String loginToFollow) {
        log.debug("Following user : {}", loginToFollow);
        User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
        User followedUser = userRepository.findOneByLogin(loginToFollow).get();
        if (followedUser != null && !followedUser.equals(currentUser)) {
            if (counterRepository.getFriendsCounter(currentUser.getLogin()) > 0) {
                for (String alreadyFollowingTest : friendRepository.findFriendsForUser(currentUser.getLogin())) {
                    if (alreadyFollowingTest.equals(loginToFollow)) {
                        log.debug("User {} already follows user {}", currentUser.getLogin(), followedUser.getLogin());
                        return false;
                    }
                }
            }
            friendRepository.addFriend(currentUser.getLogin(), followedUser.getLogin());
            counterRepository.incrementFriendsCounter(currentUser.getLogin());
            followerRepository.addFollower(followedUser.getLogin(), currentUser.getLogin());
            counterRepository.incrementFollowersCounter(followedUser.getLogin());
            // mention the friend that the user has started following him
            MentionFriend mentionFriend = statusRepository.createMentionFriend(followedUser.getLogin(), currentUser.getLogin());
            mentionlineRepository.addStatusToMentionline(mentionFriend.getLogin(), mentionFriend.getStatusId().toString());
            log.debug("User {} now follows user {} ", currentUser.getLogin(), followedUser.getLogin());
            return true;
        } else {
            log.debug("Followed user does not exist : " + loginToFollow);
            return false;
        }
    }

    /**
     * Un-follow a user.
     *
     * @return true if the operation succeeds, false otherwise
     */
    public boolean unfollowUser(String loginToUnfollow) {
        log.debug("Removing followed user : {}", loginToUnfollow);
        User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
        User userToUnfollow = userRepository.findOneByLogin(loginToUnfollow).get();
        return unfollowUser(currentUser, userToUnfollow);
    }

    /**
     * Un-follow a user.
     *
     * @return true if the operation succeeds, false otherwise
     */
    public boolean unfollowUser(User currentUser, User userToUnfollow) {
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
                log.debug("User {} has stopped following user {}", currentUser.getLogin(), loginToUnfollow);
                return true;
            } else {
                return false;
            }
        } else {
            log.debug("Followed user does not exist.");
            return false;
        }
    }

    public List<String> getFriendIdsForUser(String login) {
        log.debug("Retrieving friends for user : {}", login);
        return friendRepository.findFriendsForUser(login);
    }

    public Collection<String> getFollowerIdsForUser(String login) {
        log.debug("Retrieving followed users : {}", login);
        return followerRepository.findFollowersForUser(login);
    }

    public Collection<User> getFriendsForUser(String login) {
        Collection<String> friendLogins = friendRepository.findFriendsForUser(login);
        Collection<User> friends = new ArrayList<User>();
        for (String friendLogin : friendLogins) {
            User friend = userRepository.findOneByLogin(friendLogin).get();
            friends.add(friend);
        }
        return friends;
    }

    public Collection<User> getFollowersForUser(String login) {
        Collection<String> followersLogins = followerRepository.findFollowersForUser(login);
        Collection<User> followers = new ArrayList<User>();
        for (String followerLogin : followersLogins) {
            User follower = userRepository.findOneByLogin(followerLogin).get();
            followers.add(follower);
        }
        return followers;
    }

    /**
     * Finds if the "userLogin" user is followed by the current user.
     */
    public boolean isFollowed(String userLogin) {
        log.debug("Retrieving if you follow this user : {}", userLogin);
        boolean isFollowed = false;
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
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
        log.debug("Retrieving if you follow this user : {}", userLogin);
        boolean isFollowing = false;
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
        if (null != user && !userLogin.equals(user.getLogin())) {
//            Collection<User> users = getFriendsForUser(user.getUsername());
            Collection<User> users = getFriendsForUser(user.getLogin());
            if (null != users && users.size() > 0) {
                for (User follower : users) {
//                    if (follower.getUsername().equals(userLogin)) {
                    if (follower.getLogin().equals(userLogin)) {
                        isFollowing = true;
                        break;
                    }
                }
            }
        }
        return isFollowing;
    }

//    This method is on the chopping block to be removed. It seems that we dont need a username column.
//    private String getLoginFromUsername(String username) {
//        User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
//        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
//        return DomainUtil.getLoginFromUsernameAndDomain(username, domain);
//    }
}