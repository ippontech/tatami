package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.status.MentionFriend;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.security.UserDetailsService;
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

    @Inject
    private UserDetailsService userDetailsService;

    /**
     * Follow a user.
     *
     * @return true if the operation succeeds, false otherwise
     */
    public boolean followUser(String usernameToFollow) {
        log.debug("Following user : {}", usernameToFollow);
        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        User followedUser = userRepository.findOneByUsername(usernameToFollow).get();
        if (followedUser != null && !followedUser.equals(currentUser)) {
            if (counterRepository.getFriendsCounter(currentUser.getUsername()) > 0) {
                for (String alreadyFollowingTest : friendRepository.findFriendsForUser(currentUser.getUsername())) {
                    if (alreadyFollowingTest.equals(usernameToFollow)) {
                        log.debug("User {} already follows user {}", currentUser.getUsername(), followedUser.getUsername());
                        return false;
                    }
                }
            }
            friendRepository.addFriend(currentUser.getUsername(), followedUser.getUsername());
            counterRepository.incrementFriendsCounter(currentUser.getUsername());
            followerRepository.addFollower(followedUser.getUsername(), currentUser.getUsername());
            counterRepository.incrementFollowersCounter(followedUser.getUsername());
            // mention the friend that the user has started following him
            MentionFriend mentionFriend = statusRepository.createMentionFriend(followedUser.getUsername(), followedUser.getDomain(), currentUser.getUsername());
            mentionlineRepository.addStatusToMentionline(mentionFriend.getUsername(), mentionFriend.getStatusId().toString());
            log.debug("User {} now follows user {} ", currentUser.getUsername(), followedUser.getUsername());
            return true;
        } else {
            log.debug("Followed user does not exist : " + usernameToFollow);
            return false;
        }
    }

    /**
     * Un-follow a user.
     *
     * @return true if the operation succeeds, false otherwise
     */
    public boolean unfollowUser(String usernameToUnfollow) {
        log.debug("Removing followed user : {}", usernameToUnfollow);
        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        User userToUnfollow = userRepository.findOneByUsername(usernameToUnfollow).get();
        return unfollowUser(currentUser, userToUnfollow);
    }

    /**
     * Un-follow a user.
     *
     * @return true if the operation succeeds, false otherwise
     */
    public boolean unfollowUser(User currentUser, User userToUnfollow) {
        if (userToUnfollow != null) {
            String usernameToUnfollow = userToUnfollow.getUsername();
            boolean userAlreadyFollowed = false;
            for (String alreadyFollowingTest : friendRepository.findFriendsForUser(currentUser.getUsername())) {
                if (alreadyFollowingTest.equals(usernameToUnfollow)) {
                    userAlreadyFollowed = true;
                }
            }
            if (userAlreadyFollowed) {
                friendRepository.removeFriend(currentUser.getUsername(), usernameToUnfollow);
                counterRepository.decrementFriendsCounter(currentUser.getUsername());
                followerRepository.removeFollower(usernameToUnfollow, currentUser.getUsername());
                counterRepository.decrementFollowersCounter(usernameToUnfollow);
                log.debug("User {} has stopped following user {}", currentUser.getUsername(), usernameToUnfollow);
                return true;
            } else {
                return false;
            }
        } else {
            log.debug("Followed user does not exist.");
            return false;
        }
    }

    public List<String> getFriendIdsForUser(String username) {
        log.debug("Retrieving friends for user : {}", username);
        return friendRepository.findFriendsForUser(username);
    }

    public Collection<String> getFollowerIdsForUser(String username) {
        log.debug("Retrieving followed users : {}", username);
        return followerRepository.findFollowersForUser(username);
    }

    public Collection<User> getFriendsForUser(String username) {
        Collection<String> friendUsernames = friendRepository.findFriendsForUser(username);
        Collection<User> friends = new ArrayList<User>();
        for (String friendUsername : friendUsernames) {
            User friend = userRepository.findOneByUsername(friendUsername).get();
            friends.add(friend);
        }
        return friends;
    }

    public Collection<User> getFollowersForUser(String username) {
        Collection<String> followersUsernames = followerRepository.findFollowersForUser(username);
        Collection<User> followers = new ArrayList<User>();
        for (String followerUsername : followersUsernames) {
            User follower = userRepository.findOneByUsername(followerUsername).get();
            followers.add(follower);
        }
        return followers;
    }

    /**
     * Finds if the "userUsername" user is followed by the current user.
     */
    public boolean isFollowed(String userUsername) {
        log.debug("Retrieving if you follow this user : {}", userUsername);
        boolean isFollowed = false;
        User user = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        if (null != user && !userUsername.equals(user.getUsername())) {
            Collection<String> users = getFollowerIdsForUser(userUsername);
            if (null != users && users.size() > 0) {
                for (String follower : users) {
                    if (follower.equals(user.getUsername())) {
                        isFollowed = true;
                        break;
                    }
                }
            }
        }
        return isFollowed;
    }

    /**
     * Finds if  the current user user follow the "userUsername".
     */
    public boolean isFollowing(String userUsername) {
        log.debug("Retrieving if you follow this user : {}", userUsername);
        boolean isFollowing = false;
        User user = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        if (null != user && !userUsername.equals(user.getUsername())) {
//            Collection<User> users = getFriendsForUser(user.getUsername());
            Collection<User> users = getFriendsForUser(user.getUsername());
            if (null != users && users.size() > 0) {
                for (User follower : users) {
//                    if (follower.getUsername().equals(userUsername)) {
                    if (follower.getUsername().equals(userUsername)) {
                        isFollowing = true;
                        break;
                    }
                }
            }
        }
        return isFollowing;
    }

//    This method is on the chopping block to be removed. It seems that we dont need a username column.
//    private String getUsernameFromUsername(String username) {
//        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
//        String domain = DomainUtil.getDomainFromUsername(currentUser.getUsername());
//        return DomainUtil.getUsernameFromUsernameAndDomain(username, domain);
//    }
}
