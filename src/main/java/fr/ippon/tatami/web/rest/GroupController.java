package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.SuggestionService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.dto.StatusDTO;
import fr.ippon.tatami.service.dto.UserGroupDTO;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Collection;

/**
 * REST controller for managing groups.
 *
 * @author Julien Dubois
 */
@Controller
public class GroupController {

    private final Log log = LogFactory.getLog(GroupController.class);

    @Inject
    private TimelineService timelineService;

    @Inject
    private GroupService groupService;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private UserService userService;

    @Inject
    private SuggestionService suggestionService;

    /**
     * GET  /group/:groupId -> returns the group with the requested id
     */
    @RequestMapping(value = "/rest/groups/{groupId}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Group getGroup(@PathVariable("groupId") String groupId) {
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Group publicGroup = groupService.getGroupById(domain, groupId);
        if (publicGroup != null && publicGroup.isPublicGroup()) {
            return publicGroup;
        } else {
            Group result = null;
            Collection<Group> groups = groupService.getGroupsForUser(currentUser);
            for (Group testGroup : groups) {
                if (testGroup.getGroupId().equals(groupId)) {
                    result = testGroup;
                    break;
                }
            }
            if (result == null) {
                if (log.isInfoEnabled()) {
                    log.info("Permission denied! User " + currentUser.getLogin() + " tried to access " +
                            "group ID = " + groupId);
                }
                return null;
            }
            return result;
        }
    }

    /**
     * PUT  /group/:groupId -> update the group with the requested id
     */
    @RequestMapping(value = "/rest/groups/{groupId}",
            method = RequestMethod.PUT,
            produces = "application/json")
    @ResponseBody
    public Group updateGroup(@PathVariable("groupId") String groupId, @RequestBody Group groupEdit, HttpServletResponse response) {
        Group group = getGroup(groupId);

        if (group != null) {
            Collection<Group> groups = groupService.getGroupsWhereCurrentUserIsAdmin();
            boolean isGroupManagedByCurrentUser = false;
            for (Group testGroup : groups) {
                if (testGroup.getGroupId().equals(group.getGroupId())) {
                    isGroupManagedByCurrentUser = true;
                    break;
                }
            }
            if (!isGroupManagedByCurrentUser) {
                response.setStatus(403);
                return null;
            }
            group.setDomain(authenticationService.getCurrentUser().getDomain());
            group.setName(groupEdit.getName());
            group.setDescription(groupEdit.getDescription());
            groupService.editGroup(group);
            return group;
        } else {
            response.setStatus(404);
            return null;
        }
    }

    /**
     * DELETE  /group/:groupId -> Remove the group with the requested id
     */
    @RequestMapping(value = "/rest/groups/{groupId}",
            method = RequestMethod.DELETE,
            produces = "application/json")
    @ResponseBody
    public void removeGroup(@PathVariable("groupId") String groupId, @RequestBody Group groupEdit, HttpServletResponse response) {
        Group group = getGroup(groupId);

        if (group != null) {
            Collection<Group> groups = groupService.getGroupsWhereCurrentUserIsAdmin();
            boolean isGroupManagedByCurrentUser = false;
            for (Group testGroup : groups) {
                if (testGroup.getGroupId().equals(group.getGroupId())) {
                    isGroupManagedByCurrentUser = true;
                    break;
                }
            }
            if (!isGroupManagedByCurrentUser) {
                response.setStatus(403);
                return;
            }
            //groupService.(group);
            return;
        } else {
            response.setStatus(404);
            return;
        }
    }

    /**
     * GET  /rest/statuses/group_timeline -> get the latest status in group "ippon"
     */
    @RequestMapping(value = "/rest/statuses/group_timeline",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<StatusDTO> listStatusForGroup(@RequestParam(required = false, value = "groupId") String groupId,
                                                    @RequestParam(required = false) Integer count,
                                                    @RequestParam(required = false) String since_id,
                                                    @RequestParam(required = false) String max_id) {

        if (log.isDebugEnabled()) {
            log.debug("REST request to get statuses for group : " + groupId);
        }
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
            return timelineService.getGroupline(groupId, count, since_id, max_id);
        }
    }

    /**
     * GET  /groupmemberships/lookup -> return extended data about the user's groups
     */
    @RequestMapping(value = "/rest/groupmemberships/lookup",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Group> getUserGroups(@RequestParam("screen_name") String username) {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            if (log.isDebugEnabled()) {
                log.debug("Trying to find group for non-existing username = " + username);
            }
            return new ArrayList<Group>();
        }
        Collection<Group> groups = groupService.getGroupsForUser(user);
        return groups;
    }

    /**
     * Get groups of the current user.
     */
    @RequestMapping(value = "/rest/groups",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Group> getGroups() {
        User currentUser = authenticationService.getCurrentUser();
        Collection<Group> groups = groupService.getGroupsForUser(currentUser);

        return groups;
    }

    /**
     * Get groups of the current user.
     */
    @RequestMapping(value = "/rest/admin/groups",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Group> getAdminGroups() {
        User currentUser = authenticationService.getCurrentUser();
        Collection<Group> groupsAdmin = groupService.getGroupsWhereCurrentUserIsAdmin();

        return groupsAdmin;
    }

    /**
     * POST create new group.
     */
    @RequestMapping(value = "/rest/groups",
            method = RequestMethod.POST,
            produces = "application/json")
    @ResponseBody
    public Group createGroup(HttpServletResponse response, @RequestBody Group group) {
        User currentUser = authenticationService.getCurrentUser();
        if (group.getName() != null && !group.getName().equals("")) {
            groupService.createGroup(group.getName(), group.getDescription(), group.isPublicGroup());
        } else {
            response.setStatus(500);
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
    public Collection<Group> suggestions() {
        String login = authenticationService.getCurrentUser().getLogin();
        return suggestionService.suggestGroups(login);
    }


    /**
     * GET  /groups/{groupId}/members/ -> members of the group
     */
    @RequestMapping(value = "/rest/groups/{groupId}/members/",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<UserGroupDTO> getGroupsUsers(HttpServletResponse response, @PathVariable("groupId") String groupId) {

        User currentUser = authenticationService.getCurrentUser();
        Group currentGroup = groupService.getGroupById(currentUser.getDomain(), groupId);

        Collection<UserGroupDTO> users = null;

        if (currentUser == null) {
            response.setStatus(401); // Authentication required
        } else if (currentGroup == null) {
            response.setStatus(404); // Resource not found
        } else {
            users = groupService.getMembersForGroup(groupId);
        }
        return users;
    }


    /**
     * POST  /groups/{groupId}/members/ -> add a member to group
     */
    @RequestMapping(value = "/rest/groups/{groupId}/members/{username}",
            method = RequestMethod.PUT,
            produces = "application/json")
    @ResponseBody
    public UserGroupDTO addUserToGroup(HttpServletResponse response, @PathVariable("groupId") String groupId, @PathVariable("username") String username) {

        User currentUser = authenticationService.getCurrentUser();
        Group currentGroup = groupService.getGroupById(currentUser.getDomain(), groupId);
        User userToAdd = userService.getUserByUsername(username);

        UserGroupDTO dto = null;

        if (currentUser == null) {
            response.setStatus(401); // Authentication required
        } else if (currentGroup == null || userToAdd == null) {
            response.setStatus(404); // Resource not found
        } else {
            groupService.addMemberToGroup(userToAdd, currentGroup);
            dto = groupService.getMemberForGroup(groupId, userToAdd);
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
    public UserGroupDTO removeUserToGroup(HttpServletResponse response, @PathVariable("groupId") String groupId, @PathVariable("username") String username) {

        User currentUser = authenticationService.getCurrentUser();
        Group currentGroup = groupService.getGroupById(currentUser.getDomain(), groupId);
        User userToremove = userService.getUserByUsername(username);

        UserGroupDTO dto = null;

        if (currentUser == null) {
            response.setStatus(401); // Authentication required
        } else if (currentGroup == null || userToremove == null) {
            response.setStatus(404); // Resource not found
        } else {
            groupService.removeMemberFromGroup(userToremove, currentGroup);
            dto = groupService.getMemberForGroup(groupId, userToremove);
        }
        return dto;
    }

}
