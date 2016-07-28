package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.status.MentionFriend;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.util.DomainUtil;
import org.elasticsearch.common.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public boolean followUser(String emailToFollow) {
        log.debug("Following user : {}", emailToFollow);
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        if (!StringUtils.equals(emailToFollow, currentUserEmail)) {
            if (counterRepository.getFriendsCounter(currentUserEmail) > 0) {
                for (String alreadyFollowingTest : friendRepository.findFriendsForUser(currentUserEmail)) {
                    if (alreadyFollowingTest.equals(emailToFollow)) {
                        log.debug("User {} already follows user {}", currentUserEmail, emailToFollow);
                        return false;
                    }
                }
            }
            friendRepository.addFriend(currentUserEmail, emailToFollow);
            counterRepository.incrementFriendsCounter(currentUserEmail);
            followerRepository.addFollower(emailToFollow, currentUserEmail);
            counterRepository.incrementFollowersCounter(emailToFollow);
            // mention the friend that the user has started following him
            MentionFriend mentionFriend = statusRepository.createMentionFriend(emailToFollow, currentUserEmail);
            mentionlineRepository.addStatusToMentionline(mentionFriend.getEmail(), mentionFriend.getStatusId().toString());

            log.debug("User {} now follows user {} ", currentUserEmail, emailToFollow);
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
        return unfollowUser(SecurityUtils.getCurrentUserEmail(), emailToUnfollow);
    }

    /**
     * Un-follow a user.
     *
     * @return true if the operation succeeds, false otherwise
     */
    public boolean unfollowUser(String currentUserEmail, String userEmailToUnfollow) {
        if (StringUtils.isNotBlank(userEmailToUnfollow)) {
            boolean userAlreadyFollowed = friendRepository.findFriendsForUser(currentUserEmail).contains(userEmailToUnfollow);

            log.debug("userAlreadyFollowed :" + userAlreadyFollowed + ":" + userEmailToUnfollow);
            if (userAlreadyFollowed) {
                friendRepository.removeFriend(currentUserEmail, userEmailToUnfollow);
                counterRepository.decrementFriendsCounter(currentUserEmail);
                followerRepository.removeFollower(userEmailToUnfollow, currentUserEmail);
                counterRepository.decrementFollowersCounter(userEmailToUnfollow);
                log.debug("User {} has stopped following user {}", currentUserEmail, userEmailToUnfollow);
                return true;
            }
        } else {
            log.debug("Followed user does not exist.");
        }
        return false;
    }

    public List<String> getFriendEmailsForUser(String email) {
        log.debug("Retrieving friends for user with email : {}", email);
        return friendRepository.findFriendsForUser(email);
    }

    public Collection<String> getFollowerEmailsForUser(String userEmail) {
        log.debug("Retrieving followed users : {}", userEmail);
        return followerRepository.findFollowersForUser(userEmail);
    }

    public Collection<User> getFriendsForUser(String userEmail) {
        return friendRepository.findFriendsForUser(userEmail).stream()
            .map(friendEmail -> userRepository.findOneByEmail(friendEmail))
            .filter(Optional::isPresent)
            .map(Optional::get).collect(Collectors.toList());
    }

    public Collection<User> getFollowersForUser(String userEmail) {
        return followerRepository.findFollowersForUser(userEmail).stream()
            .map(followerEmail -> userRepository.findOneByEmail(followerEmail))
            .filter(Optional::isPresent)
            .map(Optional::get).collect(Collectors.toList());
    }

    /**
     * Finds if the "userEmail" user is followed by the current user.
     */
    public boolean isFollowed(String userEmail) {
        log.debug("Retrieving if you follow this user : {}", userEmail);
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        if (!StringUtils.equals(currentUserEmail, userEmail)) {
            return getFollowerEmailsForUser(userEmail).stream().anyMatch(email -> email.equals(currentUserEmail));
        }
        return false;
    }

    /**
     * Finds if the current user follow the "userEmail" user.
     */
    public boolean isFollowing(String userEmail) {
        log.debug("Retrieving if you follow this user : {}", userEmail);
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        if (!StringUtils.equals(currentUserEmail, userEmail)) {
            return getFollowerEmailsForUser(currentUserEmail).stream().anyMatch(email -> email.equals(userEmail));
        }
        return false;
    }
}
