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
    public boolean followUser(String emailToFollow) {
        log.debug("Following user : {}", emailToFollow);
        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        User followedUser = userRepository.findOneByEmail(emailToFollow).get();
        if (followedUser != null && !followedUser.equals(currentUser)) {
            if (counterRepository.getFriendsCounter(currentUser.getUsername()) > 0) {
                for (String alreadyFollowingTest : friendRepository.findFriendsForUser(currentUser.getUsername())) {
                    if (alreadyFollowingTest.equals(emailToFollow)) {
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
            log.debug("Followed user does not exist : " + emailToFollow);
            return false;
        }
    }

    /**
     * Un-follow a user.
     *
     * @return true if the operation succeeds, false otherwise
     */
    public boolean unfollowUser(String emailToUnfollow) {
        log.debug("Removing followed user : {}", emailToUnfollow);
        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        User userToUnfollow = userRepository.findOneByEmail(emailToUnfollow).get();
        return unfollowUser(currentUser, userToUnfollow);
    }

    /**
     * Un-follow a user.
     *
     * @return true if the operation succeeds, false otherwise
     */
    public boolean unfollowUser(User currentUser, User userToUnfollow) {
        if (userToUnfollow != null) {
            String userEmailToUnfollow = userToUnfollow.getEmail();
            boolean userAlreadyFollowed = false;
            for (String alreadyFollowingTest : friendRepository.findFriendsForUser(currentUser.getEmail())) {
                if (alreadyFollowingTest.equals(userEmailToUnfollow)) {
                    userAlreadyFollowed = true;
                }
            }
            if (userAlreadyFollowed) {
                friendRepository.removeFriend(currentUser.getEmail(), userEmailToUnfollow);
                counterRepository.decrementFriendsCounter(currentUser.getEmail());
                followerRepository.removeFollower(userEmailToUnfollow, currentUser.getEmail());
                counterRepository.decrementFollowersCounter(userEmailToUnfollow);
                log.debug("User {} has stopped following user {}", currentUser.getEmail(), userEmailToUnfollow);
                return true;
            } else {
                return false;
            }
        } else {
            log.debug("Followed user does not exist.");
            return false;
        }
    }

    public List<String> getFriendIdsForUser(String email) {
        log.debug("Retrieving friends for user with email : {}", email);
        return friendRepository.findFriendsForUser(email);
    }

    public Collection<String> getFollowerIdsForUser(String userEmail) {
        log.debug("Retrieving followed users : {}", userEmail);
        return followerRepository.findFollowersForUser(userEmail);
    }

    public Collection<User> getFriendsForUser(String userEmail) {
        Collection<String> friendEmails = friendRepository.findFriendsForUser(userEmail);
        Collection<User> friends = new ArrayList<User>();
        for (String friendEmail : friendEmails) {
            User friend = userRepository.findOneByEmail(friendEmail).get();
            friends.add(friend);
        }
        return friends;
    }

    public Collection<User> getFollowersForUser(String userEmail) {
        Collection<String> followersEmails = followerRepository.findFollowersForUser(userEmail);
        Collection<User> followers = new ArrayList<User>();
        for (String followerEmail : followersEmails) {
            User follower = userRepository.findOneByEmail(followerEmail).get();
            followers.add(follower);
        }
        return followers;
    }

    /**
     * Finds if the "userUsername" user is followed by the current user.
     */
    public boolean isFollowed(String userEmail) {
        log.debug("Retrieving if you follow this user : {}", userEmail);
        boolean isFollowed = false;
        User user = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        if (null != user && !userEmail.equals(user.getUsername())) {
            Collection<String> users = getFollowerIdsForUser(userEmail);
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
