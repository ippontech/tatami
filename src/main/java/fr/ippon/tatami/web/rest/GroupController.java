package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.TagMembershipService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.web.rest.dto.Tag;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
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

    /**
     * GET  /groups -> returns nothing, as no group is selected
     */
    @RequestMapping(value = "/rest/groups/",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Status> listStatusWithNoGroup(@RequestParam(required = false) Integer count,
                                                  @RequestParam(required = false) String since_id,
                                                  @RequestParam(required = false) String max_id) {

        return new ArrayList<Status>();
    }

    /**
     * GET  /groups/ippon -> get the latest status in group "ippon"
     */
    @RequestMapping(value = "/rest/groups/{group}/",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Status> listStatusForGroup(@PathVariable("group") String groupId,
                                               @RequestParam(required = false) Integer count,
                                               @RequestParam(required = false) String since_id,
                                               @RequestParam(required = false) String max_id) {

        if (log.isDebugEnabled()) {
            log.debug("REST request to get statuses for group : " + groupId);
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
            return new ArrayList<Status>();
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
}
