package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.web.rest.dto.UserGroupDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service bean for managing groups.
 */
@Service
public class GroupService {

    private final Logger log = LoggerFactory.getLogger(GroupService.class);

    @Inject
    private GroupRepository groupRepository;

    @Inject
    private GroupMembersRepository groupMembersRepository;

    @Inject
    private GroupCounterRepository groupCounterRepository;

    @Inject
    private UserGroupRepository userGroupRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private SearchService searchService;

    @Inject
    private FriendRepository friendRepository;

    @CacheEvict(value = "group-user-cache", allEntries = true)
    public void createGroup(String name, String description, boolean publicGroup) {
        log.debug("Creating group : {}", name);
        String domain = SecurityUtils.getCurrentUserDomain();
        String email = SecurityUtils.getCurrentUserEmail();
        UUID groupId = groupRepository.createGroup(domain, name, description, publicGroup);
        groupMembersRepository.addAdmin(groupId, email);
        groupCounterRepository.incrementGroupCounter(groupId);
        userGroupRepository.addGroupAsAdmin(email, groupId);
        searchService.addGroup(getGroupById(groupId));
    }

    @CacheEvict(value = {"group-user-cache", "group-cache"}, allEntries = true)
    public void editGroup(Group group) {
        log.debug("Editing group : {}", group.getGroupId());
        groupRepository.editGroupDetails(group.getGroupId(),
            group.getName(),
            group.getDescription(),
            group.isArchivedGroup());
        searchService.removeGroup(group);
        searchService.addGroup(group);
    }

    public Collection<UserGroupDTO> getMembersForGroup(UUID groupId, String email) {
        Map<String, String> membersMap = groupMembersRepository.findMembers(groupId);
        Collection<String> friendUsernames = friendRepository.findFriendsForUser(email);
        return membersMap.entrySet().stream()
            .map(member -> userRepository.findOneByEmail(member.getKey()))
            .filter(Optional::isPresent)
            .map(userOptional -> {
                User user = userOptional.get();
                UserGroupDTO dto = new UserGroupDTO();
                dto.setUsername(user.getUsername());
                dto.setAvatar(user.getAvatar());
                dto.setFirstName(user.getFirstName());
                dto.setLastName(user.getLastName());
                dto.setRole(membersMap.get(user.getEmail()));
                dto.setActivated(user.getActivated());
                dto.setFriend(friendUsernames.contains(user.getUsername()));
                dto.setYou(email.equals(user.getEmail()));
                return dto;
            }).collect(Collectors.toList());
    }

    public UserGroupDTO getMembersForGroup(UUID groupId, User userWanted) {
        Map<String, String> membersMap = groupMembersRepository.findMembers(groupId);
        for (Map.Entry<String, String> member : membersMap.entrySet()) {
            Optional<User> optionalUser = userRepository.findOneByEmail(member.getKey());
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                if (userWanted.equals(user)) {
                    UserGroupDTO dto = new UserGroupDTO();
                    dto.setUsername(user.getUsername());
                    dto.setAvatar(user.getAvatar());
                    dto.setFirstName(user.getFirstName());
                    dto.setLastName(user.getLastName());
                    dto.setRole(member.getValue());
                    return dto;
                }
            } else {
                log.debug("User {} was deleted", member.getKey());
            }
        }
        return null;
    }

    @Cacheable(value = "group-user-cache")
    public Collection<Group> getGroupsForUser(String email) {
        return userGroupRepository.findGroups(email).stream()
            .map(this::buildGroupIds)
            .collect(Collectors.toList());
    }

    @Cacheable(value = "group-user-cache")
    private Collection<Group> getGroupsOfUser(String email) {
        Collection<UUID> groupIds = userGroupRepository.findGroups(email);
        return getGroupDetails(groupIds);
    }

    @Cacheable(value = "group-cache")
    public Group getGroupById(UUID groupId) {
        return internalGetGroupById(groupId);
    }

    private Collection<Group> getGroupsWhereUserIsAdmin(String email) {
        Collection<UUID> groupIds = userGroupRepository.findGroupsAsAdmin(email);
        return getGroupDetails(groupIds);
    }

    private Collection<Group> getGroupDetails(Collection<UUID> groupIds) {
        return groupIds.stream()
            .map(this::internalGetGroupById)
            .collect(Collectors.toList());
    }

    public Collection<Group> getGroupsWhereCurrentUserIsAdmin() {
        return getGroupsWhereUserIsAdmin(SecurityUtils.getCurrentUserEmail());
    }

    private Group internalGetGroupById(UUID groupId) {
        Group group = groupRepository.getGroupById(groupId);
        long counter = groupCounterRepository.getGroupCounter(groupId);
        group.setCounter(counter);
        return group;
    }

    @CacheEvict(value = {"group-user-cache", "group-cache"}, allEntries = true)
    public void addMemberToGroup(User user, Group group) {
        UUID groupId = group.getGroupId();
        Collection<UUID> userCurrentGroupIds = userGroupRepository.findGroups(user.getEmail());
        boolean userIsAlreadyAMember = userCurrentGroupIds.stream().anyMatch(uuid -> uuid.equals(groupId));
        if (!userIsAlreadyAMember) {
            groupMembersRepository.addMember(groupId, user.getEmail());
            groupCounterRepository.incrementGroupCounter(groupId);
            userGroupRepository.addGroupAsMember(user.getEmail(), groupId);
        } else {
            log.debug("User {} is already a member of group {}", user.getUsername(), group.getName());
        }
    }

    @CacheEvict(value = {"group-user-cache", "group-cache"}, allEntries = true)
    public void removeMemberFromGroup(String email, Group group) {
        UUID groupId = group.getGroupId();
        Collection<UUID> userCurrentGroupIds = userGroupRepository.findGroups(email);
        boolean userIsAlreadyAMember = userCurrentGroupIds.stream().anyMatch(uuid -> uuid.equals(groupId));
        if (userIsAlreadyAMember) {
            groupMembersRepository.removeMember(groupId, email);
            groupCounterRepository.decrementGroupCounter(groupId);
            userGroupRepository.removeGroup(email, groupId);
        } else {
            log.debug("User {} is not a member of group {}", email, group.getName());
        }
    }

    public Collection<Group> buildGroupList(Collection<Group> groups) {
        String email = SecurityUtils.getCurrentUserEmail();
        return groups.stream()
            .map(group -> buildGroup(email, group))
            .collect(Collectors.toList());
    }

    private Group getGroupFromUser(String email, UUID groupId) {
        Collection<Group> groups = getGroupsOfUser(email);
        Optional<Group> groupOptional = groups.stream().filter(uGroup -> uGroup.getGroupId().equals(groupId))
            .findFirst();
        return groupOptional.isPresent() ? groupOptional.get() : null;
    }

    private boolean isGroupManagedByCurrentUser(Group group) {
        Collection<Group> groups = getGroupsWhereCurrentUserIsAdmin();
        return groups.stream().anyMatch(uGroup -> uGroup.equals(group));
    }

    private Group buildGroup(String email, Group group) {
        if (group != null) {
            if (isGroupManagedByCurrentUser(group)) {
                group.setAdministrator(true);
                group.setMember(true);
            } else if (group.isPublicGroup()) {
                Group result = getGroupFromUser(email, group.getGroupId());
                group.setAdministrator(false); // If we made it here, the user is not an admin
                group.setMember(result != null);
            } else {
                Group result = getGroupFromUser(email, group.getGroupId());
                group.setAdministrator(false); // If we make it here, the user is not an admin
                if (result == null) {
                    log.info("Permission denied! User {} tried to access group ID = {} ", email, group.getGroupId());
                    group.setMember(false); // No group found, therefore the user is not a member
                    return null;
                } else {
                    group.setMember(true); // Since a group was found, we know the user is a member
                }
            }
            long counter = getMembersForGroup(group.getGroupId(), SecurityUtils.getCurrentUserEmail()).stream()
                .filter(UserGroupDTO::isActivated).count();
            group.setCounter(counter);
        }
        return group;
    }

    private Group buildGroupIds(UUID groupId) {
        Group group = getGroupById(groupId);
        return buildGroup(SecurityUtils.getCurrentUserEmail(), group);
    }
}
