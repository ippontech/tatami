package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.SuggestionService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.web.rest.dto.StatusDTO;
import fr.ippon.tatami.web.rest.dto.UserGroupDTO;
import fr.ippon.tatami.service.util.DomainUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

/**
 * REST controller for managing groups
 */
@RestController
@RequestMapping("/tatami")
public class GroupResource {

    private final Logger log = LoggerFactory.getLogger(GroupResource.class);

    @Inject
    private TimelineService timelineService;

    @Inject
    private GroupService groupService;

    @Inject
    private UserService userService;

    @Inject
    private SuggestionService suggestionService;

    @Inject
    private UserRepository userRepository;


    /**
     * Get groups of the current user.
     */
    @RequestMapping(value = "/rest/groups",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<Group> getGroups() {
        User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
        return groupService.getGroupsForUser(currentUser);
    }

    /**
     * GET  /group/:groupId -> returns the group with the requested id
     */
    @RequestMapping(value = "/rest/groups/{groupId}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Group getGroup(@PathVariable("groupId") String groupId) {
        User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Group publicGroup = groupService.getGroupById(domain, UUID.fromString(groupId));
        if (publicGroup != null && publicGroup.isPublicGroup()) {
            Group result = getGroupFromUser(currentUser, groupId);
            Group groupClone = (Group) publicGroup.clone();
            if (result != null) {
                groupClone.setMember(true);
            }
            if (isGroupManagedByCurrentUser(publicGroup)) {
                groupClone.setAdministrator(true);
            }
            return groupClone;
        } else {
            Group result = getGroupFromUser(currentUser, groupId);
            Group groupClone = null;
            if (result == null) {
                log.info("Permission denied! User {} tried to access group ID = {} ", currentUser.getLogin(), groupId);
                return null;
            } else {
                groupClone = (Group) result.clone();
                groupClone.setMember(true);
                if (isGroupManagedByCurrentUser(publicGroup)) {
                    groupClone.setAdministrator(true);
                }
            }
            return groupClone;
        }
    }


    /**
     * PUT  /group/:groupId -> update the group with the requested id
     */
    @RequestMapping(value = "/rest/groups/{groupId}",
            method = RequestMethod.PUT,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Group updateGroup(@PathVariable("groupId") String groupId, @RequestBody Group groupEdit, HttpServletResponse response) {
        Group group = getGroup(groupId);

        if (group != null) {
            if (!isGroupManagedByCurrentUser(group)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return null;
            } else {
                String domain = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get().getDomain();
                group.setDomain(domain);
                group.setName(groupEdit.getName());
                group.setDescription(groupEdit.getDescription());
                group.setArchivedGroup(groupEdit.isArchivedGroup());
                groupService.editGroup(group);
                return group;
            }
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
    }






    @RequestMapping(value = "/rest/groups/{groupId}/timeline",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<StatusDTO> listStatusForGroup(@PathVariable(value = "groupId") String groupId,
                                                    @RequestParam(required = false) Integer count,
                                                    @RequestParam(required = false) String start,
                                                    @RequestParam(required = false) String finish) {

        log.debug("REST request to get statuses for group : {}", groupId);
        if (groupId == null) {
            return new ArrayList<StatusDTO>();
        }
        if (count == null) {
            count = 20;
        }
        Group group = this.getGroup(groupId);
        if (group == null) {
            return new ArrayList<StatusDTO>();
        } else {
            return timelineService.getGroupline(groupId, count, start, finish);
        }
    }

    /**
     * GET  /groupmemberships/lookup -> return extended data about the user's groups
     */
    @RequestMapping(value = "/rest/groupmemberships/lookup",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<Group> getUserGroups(@RequestParam("screen_name") String username) {
        User user = userRepository.findOneByLogin(username).get();
        if (user == null) {
            log.debug("Trying to find group for non-existing username = {}", username);
            return new ArrayList<Group>();
        }
        return groupService.getGroupsForUser(user);
    }



    /**
     * Get groups where the current user is admin.
     */
    @RequestMapping(value = "/rest/admin/groups",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<Group> getAdminGroups() {
        return groupService.getGroupsWhereCurrentUserIsAdmin();
    }

    /**
     * POST create new group.
     */
    @RequestMapping(value = "/rest/groups",
            method = RequestMethod.POST,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Group createGroup(HttpServletResponse response, @RequestBody Group group) {
        if (group.getName() != null && !group.getName().equals("")) {
            groupService.createGroup(group.getName(), group.getDescription(), group.isPublicGroup());
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
        return group;
    }

    /**
     * GET  /groupmemberships/suggestions -> suggest groups to join
     */
    @RequestMapping(value = "/rest/groupmemberships/suggestions",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<Group> suggestions() {
        String login = SecurityUtils.getCurrentUserLogin();
        return groupService.buildGroupList(suggestionService.suggestGroups(login));
    }


    /**
     * GET  /groups/{groupId}/members/ -> members of the group
     */
    @RequestMapping(value = "/rest/groups/{groupId}/members/",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<UserGroupDTO> getGroupsUsers(HttpServletResponse response, @PathVariable("groupId") String groupId) {

        User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
        Group currentGroup = groupService.getGroupById(currentUser.getDomain(), UUID.fromString(groupId));

        Collection<UserGroupDTO> users = null;

        if (currentUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Authentication required
        } else if (currentGroup == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND); // Resource not found
        } else {
            users = groupService.getMembersForGroup(UUID.fromString(groupId), currentUser.getLogin());
        }
        return users;
    }

    /**
     * GET  /groups/{groupId}/members/{userUsername} -> get a member to group status
     */
    @RequestMapping(value = "/rest/groups/{groupId}/members/{username}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public UserGroupDTO getUserToGroup(HttpServletResponse response, @PathVariable("groupId") String groupId, @PathVariable("username") String username) {

        User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
        Group currentGroup = groupService.getGroupById(currentUser.getDomain(), UUID.fromString(groupId));

        Collection<UserGroupDTO> users = null;

        if (currentUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Authentication required
        } else if (currentGroup == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND); // Resource not found
        } else {
            users = groupService.getMembersForGroup(UUID.fromString(groupId), currentUser.getLogin());
        }

        for (UserGroupDTO user : users) {
            if (user.getLogin().equals(currentUser.getLogin())) {
                return user;
            }
        }

        UserGroupDTO currentUserDTO = new UserGroupDTO();
        currentUserDTO.setLogin(currentUser.getLogin());
//        currentUserDTO.setUsername(currentUser.getUsername());
//        currentUserDTO.setAvatar(currentUser.getAvatar());
        currentUserDTO.setFirstName(currentUser.getFirstName());
        currentUserDTO.setLastName(currentUser.getLastName());
        currentUserDTO.setIsMember(false);

        return currentUserDTO;
    }

    /**
     * PUT  /groups/{groupId}/members/{userUsername} -> add a member to group
     */
    @RequestMapping(value = "/rest/groups/{groupId}/members/{username}",
            method = RequestMethod.PUT,
            produces = "application/json")
    @ResponseBody
    @Timed
    public UserGroupDTO addUserToGroup(HttpServletResponse response, @PathVariable("groupId") String groupId, @PathVariable("username") String username) {

        User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
        Group currentGroup = groupService.getGroupById(currentUser.getDomain(), UUID.fromString(groupId));
        User userToAdd = userRepository.findOneByLogin(username).get();

        UserGroupDTO dto = null;

        if (currentUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Authentication required
        } else if (currentGroup == null || userToAdd == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND); // Resource not found
        } else {
            if (isGroupManagedByCurrentUser(currentGroup) && !currentUser.equals(userToAdd)) {
                groupService.addMemberToGroup(userToAdd, currentGroup);
                dto = groupService.getMembersForGroup(UUID.fromString(groupId), userToAdd);
            } else if (currentGroup.isPublicGroup() && currentUser.equals(userToAdd) && !isGroupManagedByCurrentUser(currentGroup)) {
                groupService.addMemberToGroup(userToAdd, currentGroup);
                dto = groupService.getMembersForGroup(UUID.fromString(groupId), userToAdd);
            } else {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            }
        }
        return dto;
    }

    /**
     * DELETE  /groups/{groupId}/members/{userUsername} -> remove a member to group
     */
    @RequestMapping(value = "/rest/groups/{groupId}/members/{username}",
            method = RequestMethod.DELETE,
            produces = "application/json")
    @ResponseBody
    @Timed
    public boolean removeUserFromGroup(HttpServletResponse response, @PathVariable("groupId") String groupId, @PathVariable("username") String username) {

        User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
        Group currentGroup = groupService.getGroupById(currentUser.getDomain(), UUID.fromString(groupId));
        User userToremove = userRepository.findOneByLogin(username).get();

        UserGroupDTO dto = null;

        if (currentUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Authentication required
            return false;
        } else if (currentGroup == null || userToremove == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND); // Resource not found
            return false;
        } else {
            if (isGroupManagedByCurrentUser(currentGroup) && !currentUser.equals(userToremove)) {
                groupService.removeMemberFromGroup(userToremove, currentGroup);
                groupService.getMembersForGroup(UUID.fromString(groupId), userToremove);
            } else if (currentGroup.isPublicGroup() && currentUser.equals(userToremove) && !isGroupManagedByCurrentUser(currentGroup)) {
                groupService.removeMemberFromGroup(userToremove, currentGroup);
                groupService.getMembersForGroup(UUID.fromString(groupId), userToremove);
            } else {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return false;
            }
        }
        return true;
    }

    private boolean isGroupManagedByCurrentUser(Group group) {
        Collection<Group> groups = groupService.getGroupsWhereCurrentUserIsAdmin();
        boolean isGroupManagedByCurrentUser = false;
        for (Group testGroup : groups) {
            if (testGroup.getGroupId().equals(group.getGroupId())) {
                isGroupManagedByCurrentUser = true;
                break;
            }
        }
        return isGroupManagedByCurrentUser;
    }

    private Group getGroupFromUser(User currentUser, String groupId) {
        UUID uGroupId = UUID.fromString(groupId);
        Collection<Group> groups = groupService.getGroupsForUser(currentUser);
        for (Group testGroup : groups) {
            if (testGroup.getGroupId().equals(uGroupId)) {
                return testGroup;
            }
        }
        return null;
    }
}
