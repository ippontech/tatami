package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.UserGroupDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.*;

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

    @Inject
    private UserService userService;

    @CacheEvict(value = "group-user-cache", allEntries = true)
    public void createGroup(String name, String description, boolean publicGroup) {
        log.debug("Creating group : {}", name);
        String domain = SecurityUtils.getCurrentUserDomain();
        String email = SecurityUtils.getCurrentUserEmail();
        UUID groupId = groupRepository.createGroup(domain, name, description, publicGroup);
        groupMembersRepository.addAdmin(groupId, email);
        groupCounterRepository.incrementGroupCounter(domain, groupId);
        userGroupRepository.addGroupAsAdmin(email, groupId);
        Group group = getGroupById(domain, groupId);
        searchService.addGroup(group);
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
        Collection<String> friendEmails = friendRepository.findFriendsForUser(email);
        Collection<UserGroupDTO> userGroupDTOs = new TreeSet<>();
        for (Map.Entry<String, String> member : membersMap.entrySet()) {
            UserGroupDTO dto = new UserGroupDTO();
            Optional<User> optionalUser = userRepository.findOneByEmail(member.getKey());
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                dto.setEmail(user.getEmail());
                dto.setUsername(user.getUsername());
                dto.setAvatar(user.getAvatar());
                dto.setFirstName(user.getFirstName());
                dto.setLastName(user.getLastName());
                dto.setRole(member.getValue());
                dto.setActivated(user.getActivated());
                if (friendEmails.contains(user.getEmail())) {
                    dto.setFriend(true);
                }
                if (email.equals(user.getEmail())) {
                    dto.setYou(true);
                }
                userGroupDTOs.add(dto);
            } else {
                log.debug("User {} was deleted", member.getKey());
            }
        }
        return userGroupDTOs;
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


    @Cacheable(value = "group-user-cache", key = "#user.username")
    public Collection<Group> getGroupsForUser(User user) {
        Collection<UUID> groupIds = userGroupRepository.findGroups(user.getEmail());
        return buildGroupIdsList(groupIds);
    }

    @Cacheable(value = "group-user-cache", key = "#user.username")
    private Collection<Group> getGroupsOfUser(User user) {
        Collection<UUID> groupIds = userGroupRepository.findGroups(user.getEmail());
        return getGroupDetails(user, groupIds);
    }


    @Cacheable(value = "group-cache")
    public Group getGroupById(String domain, UUID groupId) {
        return internalGetGroupById(domain, groupId);
    }

    private Collection<Group> getGroupsWhereUserIsAdmin(User user) {
        Collection<UUID> groupIds = userGroupRepository.findGroupsAsAdmin(user.getEmail());
        return getGroupDetails(user, groupIds);
    }

    private Collection<Group> getGroupDetails(User currentUser, Collection<UUID> groupIds) {
        String domain = DomainUtil.getDomainFromEmail(currentUser.getEmail());
        Collection<Group> groups = new TreeSet<Group>();
        for (UUID groupId : groupIds) {
            Group group = internalGetGroupById(domain, groupId);
            groups.add(group);
        }
        return groups;
    }

    public Collection<Group> getGroupsWhereCurrentUserIsAdmin() {
        Optional<User> optionalCurrentUser = userService.getCurrentUser();
        if (optionalCurrentUser.isPresent()) {
            return getGroupsWhereUserIsAdmin(optionalCurrentUser.get());
        }
        log.warn("Current User is not found");
        return Collections.emptyList();
    }

    private Group internalGetGroupById(String domain, UUID groupId) {
        Group group = groupRepository.getGroupById(domain, groupId);
        long counter = groupCounterRepository.getGroupCounter(domain, groupId);
        group.setCounter(counter);
        return group;
    }

    @CacheEvict(value = {"group-user-cache", "group-cache"}, allEntries = true)
    public void addMemberToGroup(User user, Group group) {
        UUID groupId = group.getGroupId();
        Collection<UUID> userCurrentGroupIds = userGroupRepository.findGroups(user.getEmail());
        boolean userIsAlreadyAMember = false;
        for (UUID testGroupId : userCurrentGroupIds) {
            if (testGroupId.equals(groupId)) {
                userIsAlreadyAMember = true;
            }
        }
        if (!userIsAlreadyAMember) {
            groupMembersRepository.addMember(groupId, user.getEmail());
            log.debug("user=" + user);
            groupCounterRepository.incrementGroupCounter(user.getDomain(), groupId);
            userGroupRepository.addGroupAsMember(user.getEmail(), groupId);
        } else {
            log.debug("User {} is already a member of group {}", user.getUsername(), group.getName());
        }
    }

    @CacheEvict(value = {"group-user-cache", "group-cache"}, allEntries = true)
    public void removeMemberFromGroup(User user, Group group) {
        UUID groupId = group.getGroupId();
        Collection<UUID> userCurrentGroupIds = userGroupRepository.findGroups(user.getEmail());
        boolean userIsAlreadyAMember = false;
        for (UUID testGroupId : userCurrentGroupIds) {
            if (testGroupId.equals(groupId)) {
                userIsAlreadyAMember = true;
            }
        }
        if (userIsAlreadyAMember) {
            groupMembersRepository.removeMember(groupId, user.getEmail());
            groupCounterRepository.decrementGroupCounter(user.getDomain(), groupId);
            userGroupRepository.removeGroup(user.getEmail(), groupId);
        } else {
            log.debug("User {} is not a member of group {}", user.getUsername(), group.getName());
        }
    }


    public Collection<Group> buildGroupList(Collection<Group> groups) {
        Optional<User> optionalCurrentUser = userService.getCurrentUser();
        if (optionalCurrentUser.isPresent()) {
            return buildGroupList(optionalCurrentUser.get(), groups);
        }
        log.warn("Current User is not found");
        return Collections.emptyList();

    }

    private Collection<Group> buildGroupList(User user, Collection<Group> groups) {

        for (Group group : groups) {
            buildGroup(user, group);
        }

        return groups;
    }

    private Group buildGroup(Group group) {
        Optional<User> optionalCurrentUser = userService.getCurrentUser();
        if (optionalCurrentUser.isPresent()) {
            return buildGroup(optionalCurrentUser.get(), group);
        }
        log.warn("Current User is not found");
        return null;
    }

    private Group getGroupFromUser(User currentUser, UUID groupId) {
        Collection<Group> groups = getGroupsOfUser(currentUser);
        for (Group testGroup : groups) {
            if (testGroup.getGroupId().equals(groupId)) {
                return testGroup;
            }
        }
        return null;
    }

    private boolean isGroupManagedByCurrentUser(Group group) {
        Collection<Group> groups = getGroupsWhereCurrentUserIsAdmin();
        boolean isGroupManagedByCurrentUser = false;
        for (Group testGroup : groups) {
            if (testGroup.getGroupId().equals(group.getGroupId())) {
                isGroupManagedByCurrentUser = true;
                break;
            }
        }
        return isGroupManagedByCurrentUser;
    }

    private Group buildGroup(User user, Group group) {
        if (group != null) {
            if (isGroupManagedByCurrentUser(group)) {
                group.setAdministrator(true);
                group.setMember(true);
            } else if (group.isPublicGroup()) {
                Group result = getGroupFromUser(user, group.getGroupId());
                group.setAdministrator(false); // If we made it here, the user is not an admin
                if (result != null) {
                    group.setMember(true); // We found a group, so the user is a member
                } else {
                    group.setMember(false); // Since no group was found, the user is not a member
                }
            } else {
                Group result = getGroupFromUser(user, group.getGroupId());
                group.setAdministrator(false); // If we make it here, the user is not an admin
                if (result == null) {
                    log.info("Permission denied! User {} tried to access group ID = {} ", user.getUsername(), group.getGroupId());
                    group.setMember(false); // No group found, therefore the user is not a member
                    return null;
                } else {
                    group.setMember(true); // Since a group was found, we know the user is a member
                }
            }
            long counter = 0;
            for (UserGroupDTO userGroup : getMembersForGroup(group.getGroupId(), SecurityUtils.getCurrentUserEmail())) {
                if (userGroup.isActivated()) {
                    counter++;
                }
            }
            group.setCounter(counter);
        }
        return group;
    }

    private Collection<Group> buildGroupIdsList(Collection<UUID> groupIds) {
        Collection<Group> groups = new TreeSet<Group>();
        for (UUID groupId : groupIds) {
            groups.add(buildGroupIds(groupId));
        }
        return groups;
    }

    private Group buildGroupIds(UUID groupId) {
        Optional<User> optionalCurrentUser = userService.getCurrentUser();
        if (optionalCurrentUser.isPresent()) {
            return buildGroupIds(optionalCurrentUser.get(), groupId);
        }
        log.warn("Current User is not found");
        return null;
    }

    private Group buildGroupIds(User user, UUID groupId) {
        String domain = DomainUtil.getDomainFromEmail(user.getEmail());
        Group group = getGroupById(domain, groupId);
        return buildGroup(group);
    }
}
