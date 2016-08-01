package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.domain.ActionStatus;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.status.StatusDetails;
import fr.ippon.tatami.exception.NoUserFoundException;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.StatusUpdateService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.exception.ArchivedGroupException;
import fr.ippon.tatami.service.exception.ReplyStatusException;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.StatusDTO;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

/**
 * REST controller for managing status.
 */
@RestController
@RequestMapping("/tatami")
public class TimelineResource {

    private final Logger log = LoggerFactory.getLogger(TimelineResource.class);

    private final int defaultCount = 20;

    @Inject
    private TimelineService timelineService;

    @Inject
    private StatusUpdateService statusUpdateService;

    @Inject
    private GroupService groupService;

    @Inject
    private UserService userService;

    /**
     * GET  /rest/statuses/details/{statusId} -> returns the details for a status, specified by the statusId parameter
     */
    @RequestMapping(value = "/rest/statuses/details/{statusId}",
        method = RequestMethod.GET,
        produces = "application/json")
    @ResponseBody
    public StatusDetails getStatusDetails(@PathVariable("statusId") String statusId) {
        log.debug("REST request to get status details Id : {}", statusId);
        return timelineService.getStatusDetails(statusId);
    }

    /**
     * GET  /rest/statuses/home_timeline -> get the latest statuses from the current user
     */
    @RequestMapping(value = "/rest/statuses/home_timeline",
        method = RequestMethod.GET,
        produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<StatusDTO> listStatus(@RequestParam(required = false) Integer count,
                                            @RequestParam(required = false) String start,
                                            @RequestParam(required = false) String finish) {
        if (count == null || count == 0) {
            count = defaultCount;
        }
        return timelineService.getTimeline(count, start, finish);
    }

    /**
     * GET  /rest/company -> get the latest statuses from the domain
     *
     * NOTE: This endpoint was "/rest/statuses/domain_timeline", but was changed to match the old implementation
     * so that the mobile app could access the company timeline safely regardless of the web app's version
     */
    @RequestMapping(value = "/rest/company",
        method = RequestMethod.GET,
        produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<StatusDTO> listDomainStatus(@RequestParam(required = false) Integer count,
                                                  @RequestParam(required = false) String start,
                                                  @RequestParam(required = false) String finish) {
        if (count == null || count == 0) {
            count = defaultCount;
        }
        return timelineService.getDomainline(count, start, finish);
    }

    /**
     * GET  /rest/statuses/jdubois/timeline -> get the latest statuses from user "jdubois"
     */
    @RequestMapping(value = "/rest/statuses/{email}/timeline",
        method = RequestMethod.GET,
        produces = "application/json")
    @ResponseBody
    public ResponseEntity<Collection<StatusDTO>> listStatusForUser(@PathVariable("email") String email,
                                                                   @RequestParam(required = false) Integer count,
                                                                   @RequestParam(required = false) String start,
                                                                   @RequestParam(required = false) String finish) {
        /*
        In cases of posts where users are mentioned, we pass in a username instead of an email address when
        a user clicks the link. In these cases, we should append the current user's domain to the username
        before we proceed.

        See marked.js
        */
        if (!DomainUtil.isValidEmailAddress(email)) {
            email = DomainUtil.getEmailFromUsernameAndDomain(email, SecurityUtils.getCurrentUserDomain());
        }

        if (count == null || count == 0) {
            count = defaultCount;
        }
        log.debug("REST request to get someone's status (email={}).", email);
        try {
            Collection<StatusDTO> statusDTOs = timelineService.getUserline(email, count, start, finish);
            return ResponseEntity.ok()
                .body(statusDTOs);
        } catch (NoUserFoundException e) {
            return ResponseEntity.badRequest()
                .body(new ArrayList<>());
        }

    }

    @RequestMapping(value = "/rest/statuses/{statusId}",
        method = RequestMethod.GET,
        produces = "application/json")
    @ResponseBody
    public StatusDTO getStatus(@PathVariable("statusId") String statusId) {
        log.debug("REST request to get status Id : {}", statusId);
        return timelineService.getStatus(statusId);
    }

    @RequestMapping(value = "/rest/statuses/{statusId}",
        method = RequestMethod.DELETE)
    public void deleteStatus(@PathVariable("statusId") String statusId) {
        log.debug("REST request to get status Id : {}", statusId);
        timelineService.removeStatus(statusId);
    }

    @RequestMapping(value = "/rest/statuses/{statusId}",
        method = RequestMethod.PATCH)
    @ResponseBody
    public StatusDTO updateStatus(@RequestBody ActionStatus action, @PathVariable("statusId") String statusId) {
        StatusDTO status = timelineService.getStatus(statusId);
        if (action.isFavorite() != null && status.isFavorite() != action.isFavorite()) {
            if (action.isFavorite()) {
                timelineService.addFavoriteStatus(statusId);
            } else {
                timelineService.removeFavoriteStatus(statusId);
            }
            status.setFavorite(action.isFavorite());
        }
        if (BooleanUtils.isTrue(action.isShared())) {
            timelineService.shareStatus(statusId);
            status.setShareByMe(action.isShared());
        }
        if (BooleanUtils.isTrue(action.isAnnounced())) {
            timelineService.announceStatus(statusId);
        }
        return status;
    }

    /**
     * POST /rest/statuses/ -> create a new Status
     */
    @RequestMapping(value = "/rest/statuses",
        method = RequestMethod.POST,
        produces = "application/json")
    @Timed
    public ResponseEntity<StatusDTO> postStatus(@RequestBody StatusDTO status) throws ArchivedGroupException, ReplyStatusException {
        log.debug("REST request to add status : {}", status.getContent());
        String escapedContent = StringEscapeUtils.escapeHtml(status.getContent());
        Collection<String> attachmentIds = status.getAttachmentIds();

        if (StringUtils.isNotBlank(status.getReplyTo())) {
            log.debug("Creating a reply to : {}", status.getReplyTo());
            statusUpdateService.replyToStatus(escapedContent, status.getReplyTo(), attachmentIds);
        } else if (status.isStatusPrivate() || StringUtils.isEmpty(status.getGroupId())) {
            log.debug("Private status");
            statusUpdateService.postStatus(escapedContent, status.isStatusPrivate(), attachmentIds, status.getGeoLocalization());
        } else {
            User currentUser = userService.getCurrentUser().get();
            Collection<Group> groups = groupService.getGroupsForUser(currentUser);
            UUID statusGroupId = UUID.fromString(status.getGroupId());
            Optional<Group> groupOptional = groups.stream().filter(group -> group.getGroupId().equals(statusGroupId)).findFirst();

            if (!groupOptional.isPresent()) {
                log.info("Permission denied! User {} tried to access " +
                    "group ID = {}", currentUser.getUsername(), status.getGroupId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            } else if (groupOptional.isPresent() && groupOptional.get().isArchivedGroup()) {
                log.info("Archived group! User {} tried to post a message to archived " +
                    "group ID = {}", currentUser.getUsername(), status.getGroupId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            } else {
                statusUpdateService.postStatusToGroup(escapedContent, groupOptional.get(), attachmentIds, status.getGeoLocalization());
            }
        }
        return ResponseEntity.ok().body(status);
    }

    /**
     * POST /rest/statuses/report/{statusId} -> adds a reported status to the column family
     */
    @RequestMapping(value = "/rest/statuses/report/{statusId}",
        method = RequestMethod.POST)
    @ResponseBody
    public void reportStatus(@PathVariable("statusId") String statusId) {
        log.debug("REST request to get status details Id : {}", statusId);
        statusUpdateService.reportedStatus(userService.getCurrentUser().get(), statusId);
    }

    /**
     * GET rest/statuses/report/reportedList -> gets the reported statuses
     */
    @RequestMapping(value = "rest/statuses/report/reportedList",
        method = RequestMethod.GET,
        produces = "application/json")
    @ResponseBody
    public Collection<StatusDTO> getReportedStatuses() {
        log.debug("REST request to get all reported statuses");
        Collection<StatusDTO> reportedStatusList = statusUpdateService.findReportedStatuses();
        return reportedStatusList;
    }

    /**
     * GET rest/statuses/report/{statusId} -> adds deleted reported status to second column family
     */
    @RequestMapping(value = "/rest/statuses/report/{statusId}",
        method = RequestMethod.PUT)
    @ResponseBody
    public void deleteReportedStatus(@PathVariable("statusId") String statusId) {
        log.debug("REST request to delete a status Id : {}", statusId);
        statusUpdateService.deleteReportedStatus(statusId);
    }

    /**
     * GET rest/statuses/report/{statusId} -> deletes approved status from the column family
     */
    @RequestMapping(value = "/rest/statuses/report/{statusId}",
        method = RequestMethod.DELETE)
    @ResponseBody
    public void approveReportedStatus(@PathVariable("statusId") String statusId) {
        log.debug("REST request to approve a status Id : {}", statusId);
        statusUpdateService.approveReportedStatus(statusId);
    }

    /**
     * POST /rest/statuses/hide/{statusId} -> removes status from current user Timelime
     */
    @RequestMapping(value = "/rest/statuses/hide/{statusId}",
        method = RequestMethod.POST)
    @ResponseBody
    public void hideStatus(@PathVariable("statusId") String statusId) {
        log.debug("REST request to hide status Id : {}", statusId);
        timelineService.hideStatus(statusId);
    }

}
