package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.dto.UserGroupDTO;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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

    private final Log log = LogFactory.getLog(GroupService.class);

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

    @CacheEvict(value = "group-user-cache", allEntries = true)
    public void createGroup(String name, String description, boolean publicGroup) {
        if (log.isDebugEnabled()) {
            log.debug("Creating group : " + name);
        }
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
        groupDetailsRepository.editGroupDetails(group.getGroupId(),
                group.getName(),
                group.getDescription(),
                group.isArchivedGroup());

        searchService.removeGroup(group);
        searchService.addGroup(group);
    }

    public Collection<UserGroupDTO> getMembersForGroup(String groupId) {
        Map<String, String> membersMap = groupMembersRepository.findMembers(groupId);
        Collection<UserGroupDTO> userGroupDTOs = new TreeSet<UserGroupDTO>();
        for (Map.Entry<String, String> member : membersMap.entrySet()) {
            UserGroupDTO dto = new UserGroupDTO();
            User user = userRepository.findUserByLogin(member.getKey());
            dto.setLogin(user.getLogin());
            dto.setUsername(user.getUsername());
            dto.setGravatar(user.getGravatar());
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setRole(member.getValue());
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
                dto.setGravatar(user.getGravatar());
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

    public Collection<Group> getGroupsWhereCurrentUserIsAdmin() {
        User currentUser = authenticationService.getCurrentUser();
        return getGroupsWhereUserIsAdmin(currentUser);
    }

    public Collection<Group> getGroupsWhereCurrentUserIsAdmin(String login) {
        User currentUser = authenticationService.getCurrentUser();
        Collection<String> groupIds = userGroupRepository.findGroupsAsAdmin(login);
        return getGroupDetails(currentUser, groupIds);
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
            groupCounterRepository.incrementGroupCounter(user.getDomain(), groupId);
            userGroupRepository.addGroupAsMember(user.getLogin(), groupId);
        } else {
            if (log.isDebugEnabled()) {
                log.debug("User " + user.getLogin() + " is already a member of group " + group.getName());
            }
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
            if (log.isDebugEnabled()) {
                log.debug("User " + user.getLogin() + " is not a member of group " + group.getName());
            }
        }
    }
}
