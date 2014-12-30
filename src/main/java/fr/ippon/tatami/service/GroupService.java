package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.dto.UserGroupDTO;
import fr.ippon.tatami.service.util.DomainUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.Collection;
import java.util.Map;
import java.util.TreeSet;

/**
 * Service bean for managing groups.
 */
@Service
public class GroupService {

    private final Logger log = LoggerFactory.getLogger(GroupService.class);

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private GroupRepository groupRepository;

    @Inject
    private GroupDetailsRepository groupDetailsRepository;

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
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        String groupId = groupRepository.createGroup(domain);
        groupDetailsRepository.createGroupDetails(groupId, name, description, publicGroup);
        groupMembersRepository.addAdmin(groupId, currentUser.getLogin());
        groupCounterRepository.incrementGroupCounter(domain, groupId);
        userGroupRepository.addGroupAsAdmin(currentUser.getLogin(), groupId);
        Group group = getGroupById(domain, groupId);
        searchService.addGroup(group);
    }

    @CacheEvict(value = {"group-user-cache", "group-cache"}, allEntries = true)
    public void editGroup(Group group) {
        log.debug("Editing group : {}", group.getGroupId());
        groupDetailsRepository.editGroupDetails(group.getGroupId(),
                group.getName(),
                group.getDescription(),
                group.isArchivedGroup());
        searchService.removeGroup(group);
        searchService.addGroup(group);
    }

    public Collection<UserGroupDTO> getMembersForGroup(String groupId, String login) {
        Map<String, String> membersMap = groupMembersRepository.findMembers(groupId);
        Collection<String> friendLogins = friendRepository.findFriendsForUser(login);
        Collection<UserGroupDTO> userGroupDTOs = new TreeSet<UserGroupDTO>();
        for (Map.Entry<String, String> member : membersMap.entrySet()) {
            UserGroupDTO dto = new UserGroupDTO();
            User user = userRepository.findUserByLogin(member.getKey());
            dto.setLogin(user.getLogin());
            dto.setUsername(user.getUsername());
            dto.setAvatar(user.getAvatar());
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setRole(member.getValue());
            dto.setActivated(user.getActivated());
            if (friendLogins.contains(user.getLogin())) {
                dto.setFriend(true);
            }
            if (login.equals(user.getLogin())) {
                dto.setYou(true);
            }
            userGroupDTOs.add(dto);
        }
        return userGroupDTOs;
    }




    public UserGroupDTO getMembersForGroup(String groupId, User userWanted) {
        Map<String, String> membersMap = groupMembersRepository.findMembers(groupId);
        for (Map.Entry<String, String> member : membersMap.entrySet()) {
            User user = userRepository.findUserByLogin(member.getKey());
            if (user.getLogin() == userWanted.getLogin()) {
                UserGroupDTO dto = new UserGroupDTO();
                dto.setLogin(user.getLogin());
                dto.setUsername(user.getUsername());
                dto.setAvatar(user.getAvatar());
                dto.setFirstName(user.getFirstName());
                dto.setLastName(user.getLastName());
                dto.setRole(member.getValue());
                return dto;
            }
        }
        return null;
    }


    @Cacheable(value = "group-user-cache", key = "#user.login")
    public Collection<Group> getGroupsForUser(User user) {
        Collection<String> groupIds = userGroupRepository.findGroups(user.getLogin());
        return buildGroupIdsList(groupIds);
    }

    @Cacheable(value = "group-user-cache", key = "#user.login")
    public Collection<Group> getGroupsOfUser(User user) {
        Collection<String> groupIds = userGroupRepository.findGroups(user.getLogin());
        return getGroupDetails(user, groupIds);
    }


    @Cacheable(value = "group-cache")
    public Group getGroupById(String domain, String groupId) {
        return internalGetGroupById(domain, groupId);
    }

    public Collection<Group> getGroupsWhereUserIsAdmin(User user) {
        Collection<String> groupIds = userGroupRepository.findGroupsAsAdmin(user.getLogin());
        return getGroupDetails(user, groupIds);
    }

    private Collection<Group> getGroupDetails(User currentUser, Collection<String> groupIds) {
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Collection<Group> groups = new TreeSet<Group>();
        for (String groupId : groupIds) {
            Group group = internalGetGroupById(domain, groupId);
            groups.add(group);
        }
        return groups;
    }

    public Collection<Group> getGroupsWhereCurrentUserIsAdmin() {
        User currentUser = authenticationService.getCurrentUser();
        return getGroupsWhereUserIsAdmin(currentUser);
    }

    private Group internalGetGroupById(String domain, String groupId) {
        Group group = groupRepository.getGroupById(domain, groupId);
        Group groupDetails = groupDetailsRepository.getGroupDetails(groupId);
        group.setName(groupDetails.getName());
        group.setPublicGroup(groupDetails.isPublicGroup());
        group.setArchivedGroup(groupDetails.isArchivedGroup());
        group.setDescription(groupDetails.getDescription());
        long counter = groupCounterRepository.getGroupCounter(domain, groupId);
        group.setCounter(counter);
        return group;
    }

    @CacheEvict(value = {"group-user-cache", "group-cache"}, allEntries = true)
    public void addMemberToGroup(User user, Group group) {
        String groupId = group.getGroupId();
        Collection<String> userCurrentGroupIds = userGroupRepository.findGroups(user.getLogin());
        boolean userIsAlreadyAMember = false;
        for (String testGroupId : userCurrentGroupIds) {
            if (testGroupId.equals(groupId)) {
                userIsAlreadyAMember = true;
            }
        }
        if (!userIsAlreadyAMember) {
            groupMembersRepository.addMember(groupId, user.getLogin());
            log.debug("user=" + user);
            groupCounterRepository.incrementGroupCounter(user.getDomain(), groupId);
            userGroupRepository.addGroupAsMember(user.getLogin(), groupId);
        } else {
            log.debug("User {} is already a member of group {}", user.getLogin(), group.getName());
        }
    }

    @CacheEvict(value = {"group-user-cache", "group-cache"}, allEntries = true)
    public void removeMemberFromGroup(User user, Group group) {
        String groupId = group.getGroupId();
        Collection<String> userCurrentGroupIds = userGroupRepository.findGroups(user.getLogin());
        boolean userIsAlreadyAMember = false;
        for (String testGroupId : userCurrentGroupIds) {
            if (testGroupId.equals(groupId)) {
                userIsAlreadyAMember = true;
            }
        }
        if (userIsAlreadyAMember) {
            groupMembersRepository.removeMember(groupId, user.getLogin());
            groupCounterRepository.decrementGroupCounter(user.getDomain(), groupId);
            userGroupRepository.removeGroup(user.getLogin(), groupId);
        } else {
            log.debug("User {} is not a member of group {}", user.getLogin(), group.getName());
        }
    }


    public Collection<Group> buildGroupList(Collection<Group> groups) {
        User currentUser = authenticationService.getCurrentUser();
        return buildGroupList(currentUser, groups);
    }

    public Collection<Group> buildGroupList(User user, Collection<Group> groups) {

        for (Group group : groups) {
            buildGroup(user, group);
        }

        return groups;
    }

    public Group buildGroup(Group group) {
        User currentUser = authenticationService.getCurrentUser();
        return buildGroup(currentUser, group);
    }

    private Group getGroupFromUser(User currentUser, String groupId) {
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

    public Group buildGroup(User user, Group group) {
        if(group != null ) {
            if (isGroupManagedByCurrentUser(group)) {
                group.setAdministrator(true);
                group.setMember(true);
            }
            else if(group.isPublicGroup()) {
                Group result = getGroupFromUser(user, group.getGroupId());
                group.setAdministrator(false); // If we made it here, the user is not an admin
                if (result != null) {
                    group.setMember(true); // We found a group, so the user is a member
                }
                else {
                    group.setMember(false); // Since no group was found, the user is not a member
                }
            }
            else {
                Group result = getGroupFromUser(user, group.getGroupId());
                group.setAdministrator(false); // If we make it here, the user is not an admin
                if (result == null) {
                    log.info("Permission denied! User {} tried to access group ID = {} ", user.getLogin(), group.getGroupId());
                    group.setMember(false); // No group found, therefore the user is not a member
                    return null;
                } else {
                    group.setMember(true); // Since a group was found, we know the user is a member
                }
            }
            long counter = 0;
            for ( UserGroupDTO userGroup :  getMembersForGroup(group.getGroupId(),authenticationService.getCurrentUser().getLogin()) ) {
                if(userGroup.isActivated()) {
                    counter++;
                }
            }
            group.setCounter(counter);
        }
        return group;
    }

    public Collection<Group> buildGroupIdsList(Collection<String> groupIds) {
        Collection<Group> groups = new TreeSet<Group>();
        for (String groupId : groupIds) {
            groups.add(buildGroupIds(groupId));
        }
        return groups;
    }

    public Group buildGroupIds(String groupId) {
        User currentUser = authenticationService.getCurrentUser();
        return buildGroupIds(currentUser, groupId);
    }

    public Group buildGroupIds(User user, String groupId) {
        String domain = DomainUtil.getDomainFromLogin(user.getLogin());
        Group group = getGroupById(domain, groupId);
        return buildGroup(group);
    }
}
