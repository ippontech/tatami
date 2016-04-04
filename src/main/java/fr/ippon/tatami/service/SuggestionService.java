package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserGroupRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.service.util.DomainUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.*;

import fr.ippon.tatami.web.rest.util.AnalysisUtil;

/**
 * Analyses data to find suggestions of users, groups... for the current user.
 */
@Service
public class SuggestionService {

    private final Logger log = LoggerFactory.getLogger(SuggestionService.class);

    private static final int SAMPLE_SIZE = 20;

    private static final int SUB_SAMPLE_SIZE = 100;

    private static final int SUGGESTIONS_SIZE = 3;

    @Inject
    private FriendshipService friendshipService;

    @Inject
    private UserGroupRepository userGroupRepository;

    @Inject
    private GroupService groupService;

    @Inject
    private UserRepository userRepository;

    /**
     * Size of the sample data used to find the suggestions.
     */

    @Cacheable("suggest-users-cache")
    public Collection<User> suggestUsers(String username) {
        Map<String, Integer> userCount = new HashMap<String, Integer>();
        List<String> friendIds = friendshipService.getFriendIdsForUser(username);
        List<String> sampleFriendIds = AnalysisUtil.reduceCollectionSize(friendIds, SAMPLE_SIZE);
        for (String friendId : sampleFriendIds) {
            List<String> friendsOfFriend = friendshipService.getFriendIdsForUser(friendId);
            friendsOfFriend = AnalysisUtil.reduceCollectionSize(friendsOfFriend, SUB_SAMPLE_SIZE);
            for (String friendOfFriend : friendsOfFriend) {
                if (!friendIds.contains(friendOfFriend) && !friendOfFriend.equals(username)) {
                    AnalysisUtil.incrementKeyCounterInMap(userCount, friendOfFriend);
                }
            }
        }
        List<String> mostFollowedUsers = AnalysisUtil.findMostUsedKeys(userCount);
        List<User> userSuggestions = new ArrayList<User>();
        for (String mostFollowedUser : mostFollowedUsers) {
            User suggestion = userRepository.findOneByUsername(mostFollowedUser).get();
            if ( suggestion.getActivated() ){
                userSuggestions.add(suggestion);
            }
        }
        if (userSuggestions.size() > SUGGESTIONS_SIZE) {
            return userSuggestions.subList(0, SUGGESTIONS_SIZE);
        } else {
            return userSuggestions;
        }
    }

    @Cacheable("suggest-groups-cache")
    public Collection<Group> suggestGroups(String username) {
        Map<String, Integer> groupCount = new HashMap<>();
        List<UUID> groupIds = userGroupRepository.findGroups(username);
        List<String> friendIds = friendshipService.getFriendIdsForUser(username);
        friendIds = AnalysisUtil.reduceCollectionSize(friendIds, SAMPLE_SIZE);
        for (String friendId : friendIds) {
            List<UUID> groupsOfFriend = userGroupRepository.findGroups(friendId);
            for (UUID groupOfFriend : groupsOfFriend) {
                if (!groupIds.contains(groupOfFriend)) {
                    AnalysisUtil.incrementKeyCounterInMap(groupCount, groupOfFriend.toString());
                }
            }
        }
        List<String> mostFollowedGroups = AnalysisUtil.findMostUsedKeys(groupCount);
        List<Group> groupSuggestions = new ArrayList<Group>();
        String email = userRepository.findOneByUsername(username).get().getEmail();
        String domain = DomainUtil.getDomainFromEmail(email);
        for (String mostFollowedGroup : mostFollowedGroups) {
            Group suggestion = groupService.getGroupById(domain, UUID.fromString(mostFollowedGroup));
            if (suggestion.isPublicGroup()) { // Only suggest public groups for the moment
                groupSuggestions.add(suggestion);
            }
        }
        if (groupSuggestions.size() > SUGGESTIONS_SIZE) {
            return groupSuggestions.subList(0, SUGGESTIONS_SIZE);
        } else {
            log.error("groupSuggestions: " + groupSuggestions);
            return groupSuggestions;
        }
    }


}
