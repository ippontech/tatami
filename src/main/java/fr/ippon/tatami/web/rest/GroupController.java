package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.SuggestionService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.dto.StatusDTO;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

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
        Collection<Group> groups = groupService.getGroupsForUser(currentUser);
        Group group = null;
        for (Group testGroup : groups) {
            if (testGroup.getGroupId().equals(groupId)) {
                group = testGroup;
                break;
            }
        }
        if (group == null) {
            if (log.isInfoEnabled()) {
                log.info("Permission denied! User " + currentUser.getLogin() + " tried to access " +
                        "group ID = " + groupId);
            }
            return null;
        }
        return group;
    }

    /**
     * PUT  /group/:groupId -> update the group with the requested id
     */
    @RequestMapping(value = "/rest/groups/{groupId}",
            method = RequestMethod.PUT,
            produces = "application/json")
    @ResponseBody
    public Group updateGroup(@PathVariable("groupId") String groupId, @RequestBody Group groupEdit,  HttpServletResponse response) {
        Group group = getGroup(groupId);

        if(group != null){
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
        }
        else {
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
    public void removeGroup(@PathVariable("groupId") String groupId, @RequestBody Group groupEdit,  HttpServletResponse response) {
        Group group = getGroup(groupId);

        if(group != null){
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
        }
        else {
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
        User currentUser = authenticationService.getCurrentUser();
        Collection<Group> groups = groupService.getGroupsForUser(currentUser);
        boolean userIsMemberOfGroup = false;
        for (Group group : groups) {
            if (group.getGroupId().equals(groupId)) {
                userIsMemberOfGroup = true;
                break;
            }
        }
        if (!userIsMemberOfGroup) {
            if (log.isInfoEnabled()) {
                log.info("Permission denied! User " + currentUser.getLogin() + " tried to access " +
                        "group ID = " + groupId);
            }
            return new ArrayList<StatusDTO>();
        }
        return timelineService.getGroupline(groupId, count, since_id, max_id);
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
        if ( group.getName() != null && !group.getName().equals("")) {
            groupService.createGroup(group.getName(), group.getDescription(), group.isPublicGroup());
        }
        else {
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

}
