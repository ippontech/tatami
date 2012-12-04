package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.StatusDetails;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.StatusUpdateService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.dto.StatusDTO;
import fr.ippon.tatami.web.rest.dto.Reply;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.Collection;

/**
 * REST controller for managing status.
 *
 * @author Julien Dubois
 */
@Controller
public class TimelineController {

    private final Log log = LogFactory.getLog(TimelineController.class);

    @Inject
    private TimelineService timelineService;

    @Inject
    private StatusUpdateService statusUpdateService;

    @Inject
    private GroupService groupService;

    @Inject
    private AuthenticationService authenticationService;

    @ExceptionHandler(ConstraintViolationException.class)
    public void handleConstraintViolationException(ConstraintViolationException cve, HttpServletResponse response) {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        if (log.isDebugEnabled()) {
            for (ConstraintViolation cv : cve.getConstraintViolations()) {
                log.debug("Violation : " + cv.getMessage());
            }
        }
    }

    /**
     * POST /statuses/update -> create a new Status
     */
    @RequestMapping(value = "/rest/statuses/update",
            method = RequestMethod.POST)
    public void postStatus(@RequestBody Status status) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to add status : " + status.getContent());
        }
        String escapedContent = StringEscapeUtils.escapeHtml(status.getContent());
        if (status.getStatusPrivate() == null) {
            status.setStatusPrivate(false);
        }
        if (status.getStatusPrivate() == true || status.getGroupId() == null || status.getGroupId().equals("")) {
            log.info("private=" + status.getStatusPrivate());
            statusUpdateService.postStatus(escapedContent, status.getStatusPrivate());
        } else {
            User currentUser = authenticationService.getCurrentUser();
            Collection<Group> groups = groupService.getGroupsForUser(currentUser);
            Group group = null;
            for (Group testGroup : groups) {
                if (testGroup.getGroupId().equals(status.getGroupId())) {
                    group = testGroup;
                    break;
                }
            }
            if (group == null) {
                if (log.isInfoEnabled()) {
                    log.info("Permission denied! User " + currentUser.getLogin() + " tried to access " +
                            "group ID = " + status.getGroupId());
                }
            } else {
                statusUpdateService.postStatusToGroup(escapedContent, group);
            }
        }
    }

    /**
     * POST /statuses/discussion/:id -> reply to this Status
     */
    @RequestMapping(value = "/rest/statuses/discussion",
            method = RequestMethod.POST)
    public void replyToStatus(@RequestBody Reply reply) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to reply to status : " + reply);
        }
        String escapedContent = StringEscapeUtils.escapeHtml(reply.getContent());
        statusUpdateService.replyToStatus(escapedContent, reply.getStatusId());
    }

    /**
     * POST /statuses/destroy/:id -> delete Status
     */
    @RequestMapping(value = "/rest/statuses/destroy/{statusId}",
            method = RequestMethod.POST)
    @ResponseBody
    public void removeStatus(@PathVariable("statusId") String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to remove status : " + statusId);
        }
        timelineService.removeStatus(statusId);
    }

    /**
     * GET  /statuses/show/:id -> returns a single status, specified by the id parameter
     */
    @RequestMapping(value = "/rest/statuses/show/{statusId}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public StatusDTO getStatus(@PathVariable("statusId") String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get status Id : " + statusId);
        }
        return timelineService.getStatus(statusId);
    }

    /**
     * GET  /statuses/details/:id -> returns the details for a status, specified by the id parameter
     */
    @RequestMapping(value = "/rest/statuses/details/{statusId}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public StatusDetails getStatusDetails(@PathVariable("statusId") String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get status details Id : " + statusId);
        }
        return timelineService.getStatusDetails(statusId);
    }

    /**
     * POST /statuses/share/:id -> Shares the status
     */
    @RequestMapping(value = "/rest/statuses/share/{statusId}",
            method = RequestMethod.POST)
    @ResponseBody
    public void favoriteStatus(@PathVariable("statusId") String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to share status : " + statusId);
        }
        timelineService.shareStatus(statusId);
    }

    /**
     * GET  /statuses/home_timeline -> get the latest statuses from the current user
     */
    @RequestMapping(value = "/rest/statuses/home_timeline",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<StatusDTO> listStatus(@RequestParam(required = false) Integer count,
                                            @RequestParam(required = false) String since_id,
                                            @RequestParam(required = false) String max_id) {
        if (count == null || count == 0) {
            count = 20; //Default value
        }
        return timelineService.getTimeline(count, since_id, max_id);
    }

    /**
     * GET  /statuses/user_timeline?screen_name=jdubois -> get the latest statuses from user "jdubois"
     */
    @RequestMapping(value = "/rest/statuses/user_timeline",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<StatusDTO> listStatusForUser(@RequestParam("screen_name") String username,
                                                   @RequestParam(required = false) Integer count,
                                                   @RequestParam(required = false) String since_id,
                                                   @RequestParam(required = false) String max_id) {

        if (count == null || count == 0) {
            count = 20; //Default value
        }
        if (log.isDebugEnabled()) {
            log.debug("REST request to get someone's status (username=" + username + ").");
        }
        return timelineService.getUserline(username, count, since_id, max_id);
    }
}