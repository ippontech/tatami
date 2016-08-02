package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.GroupRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.SuggestionService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.web.rest.dto.StatusDTO;
import fr.ippon.tatami.web.rest.dto.UserGroupDTO;
import org.elasticsearch.common.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

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
    private GroupRepository groupRepository;

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
        return groupService.getGroupsForUser(SecurityUtils.getCurrentUserEmail());
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
        String email = SecurityUtils.getCurrentUserEmail();
        Group publicGroup = groupService.getGroupById(UUID.fromString(groupId));
        if (publicGroup != null && publicGroup.isPublicGroup()) {
            Group result = getGroupFromUser(email, groupId);
            Group groupClone = (Group) publicGroup.clone();
            groupClone.setMember(result != null);
            groupClone.setAdministrator(isGroupManagedByCurrentUser(publicGroup));
            return groupClone;
        } else {
            Group result = getGroupFromUser(email, groupId);
            Group groupClone = null;
            if (result == null) {
                log.info("Permission denied! User {} tried to access group ID = {} ", email, groupId);
            } else {
                groupClone = (Group) result.clone();
                groupClone.setMember(true);
                groupClone.setAdministrator(isGroupManagedByCurrentUser(publicGroup));
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
                String domain = SecurityUtils.getCurrentUserDomain();
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
            return new ArrayList<>();
        }
        if (count == null) {
            count = 20;
        }
        Group group = getGroup(groupId);
        if (group == null) {
            return new ArrayList<>();
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
    public Collection<Group> getUserGroups(@RequestParam("screen_name") String email) {
        return groupService.getGroupsForUser(email);
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
        if (StringUtils.isNotBlank(group.getName())) {
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
        return groupService.buildGroupList(suggestionService.suggestGroups(SecurityUtils.getCurrentUserEmail()));
    }

    /**
     * GET  /groups/{groupId}/members/ -> members of the group
     */
    @RequestMapping(value = "/rest/groups/{groupId}/members",
        method = RequestMethod.GET,
        produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<UserGroupDTO> getGroupsUsers(HttpServletResponse response, @PathVariable("groupId") String groupId) {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        Group currentGroup = groupService.getGroupById(UUID.fromString(groupId));

        Collection<UserGroupDTO> users = null;

        if (currentUserEmail == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Authentication required
        } else if (currentGroup == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND); // Resource not found
        } else {
            users = groupService.getMembersForGroup(UUID.fromString(groupId), currentUserEmail);
        }
        return users;
    }

    /**
     * GET  /groups/{groupId}/members/{userEmail} -> get a member to group status
     */
    @RequestMapping(value = "/rest/groups/{groupId}/members/{email}",
        method = RequestMethod.GET,
        produces = "application/json")
    @ResponseBody
    @Timed
    public UserGroupDTO getUserToGroup(HttpServletResponse response, @PathVariable("groupId") String groupId, @PathVariable("email") String email) {
        Group currentGroup = groupService.getGroupById(UUID.fromString(groupId));

        if (!SecurityUtils.isAuthenticated()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Authentication required
        } else if (currentGroup == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND); // Resource not found
        } else {
            Collection<UserGroupDTO> users = groupService.getMembersForGroup(UUID.fromString(groupId), email);
            Optional<UserGroupDTO> userGroupDTOOptional = users.stream()
                .filter(userGroupDTO -> userGroupDTO.getEmail().equals(email))
                .findFirst();
            if (userGroupDTOOptional.isPresent()) {
                return userGroupDTOOptional.get();
            }

            Optional<User> userOptional = userRepository.findOneByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                UserGroupDTO currentUserDTO = new UserGroupDTO();
                currentUserDTO.setUsername(user.getUsername());
                currentUserDTO.setAvatar(user.getAvatar());
                currentUserDTO.setFirstName(user.getFirstName());
                currentUserDTO.setLastName(user.getLastName());
                currentUserDTO.setIsMember(false);
                return currentUserDTO;
            }
        }

        return null;
    }

    /**
     * PUT  /groups/{groupId}/members/{userEmail} -> add a member to group
     */
    @RequestMapping(value = "/rest/groups/{groupId}/members/{email}",
        method = RequestMethod.PUT,
        produces = "application/json")
    @ResponseBody
    @Timed
    public UserGroupDTO addUserToGroup(HttpServletResponse response, @PathVariable("groupId") String groupId, @PathVariable("email") String email) {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        Group currentGroup = groupService.getGroupById(UUID.fromString(groupId));
        Optional<User> optionalUserToAdd = userRepository.findOneByEmail(email);

        UserGroupDTO dto = null;

        if (currentUserEmail == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Authentication required
        } else if (currentGroup == null || !optionalUserToAdd.isPresent()) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND); // Resource not found
        } else {
            User userToAdd = optionalUserToAdd.get();
            if (isGroupManagedByCurrentUser(currentGroup) && !currentUserEmail.equals(userToAdd.getEmail())) {
                groupService.addMemberToGroup(userToAdd, currentGroup);
                dto = groupService.getMembersForGroup(UUID.fromString(groupId), userToAdd);
            } else if (currentGroup.isPublicGroup() && currentUserEmail.equals(userToAdd.getEmail()) && !isGroupManagedByCurrentUser(currentGroup)) {
                groupService.addMemberToGroup(userToAdd, currentGroup);
                dto = groupService.getMembersForGroup(UUID.fromString(groupId), userToAdd);
            } else {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            }
        }
        return dto;
    }

    /**
     * DELETE  /groups/{groupId}/members/{userEmail} -> remove a member to group
     */
    @RequestMapping(value = "/rest/groups/{groupId}/members/{email}",
        method = RequestMethod.DELETE,
        produces = "application/json")
    @ResponseBody
    @Timed
    public boolean removeUserFromGroup(HttpServletResponse response, @PathVariable("groupId") String groupId, @PathVariable("email") String email) {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();
        Group currentGroup = groupService.getGroupById(UUID.fromString(groupId));

        if (currentUserEmail == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Authentication required
            return false;
        } else if (currentGroup == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND); // Resource not found
            return false;
        } else {
            if (isGroupManagedByCurrentUser(currentGroup) && !currentUserEmail.equals(email)) {
                groupService.removeMemberFromGroup(email, currentGroup);
                groupService.getMembersForGroup(UUID.fromString(groupId), email);
            } else if (currentGroup.isPublicGroup() && currentUserEmail.equals(email) && !isGroupManagedByCurrentUser(currentGroup)) {
                groupService.removeMemberFromGroup(email, currentGroup);
                groupService.getMembersForGroup(UUID.fromString(groupId), email);
            } else {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return false;
            }
        }
        return true;
    }

    private boolean isGroupManagedByCurrentUser(Group group) {
        Collection<Group> groups = groupService.getGroupsWhereCurrentUserIsAdmin();
        return groups.stream().anyMatch(uGroup -> uGroup.equals(group));
    }

    private Group getGroupFromUser(String email, String groupId) {
        UUID uGroupId = UUID.fromString(groupId);
        Optional<Group> uGroup = groupService.getGroupsForUser(email).stream()
            .filter(group -> group.getGroupId().equals(uGroupId))
            .findFirst();
        return uGroup.isPresent() ? uGroup.get() : null;
    }

    /**
     * SEARCH  /_search/users/:query -> search for the User corresponding
     * to the query.
     */
    @RequestMapping(value = "/rest/search/groups/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Group> search(@PathVariable String query) {
        List<Group> groups = new ArrayList<>();
        Group g = new Group();
        g.setName(query);
        g.setPublicGroup(true);
        g.setDescription("Test data");
        g.setDomain("1");
        g.setGroupId(groupRepository.createGroup(g.getDomain(), g.getName(), g.getDescription(), g.isPublicGroup()));

        groups.add(g);
        return groups;
    }
}
