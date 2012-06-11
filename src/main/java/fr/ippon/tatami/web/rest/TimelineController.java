package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.service.TimelineService;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
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

    /**
     * POST /statuses/update -> create a new Status
     */
    @RequestMapping(value = "/rest/statuses/update",
            method = RequestMethod.POST)
    public void postStatus(@RequestBody String content) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to add status : " + content);
        }
        String escapedContent = StringEscapeUtils.escapeHtml(content);
        timelineService.postStatus(escapedContent);
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
    public Status getStatus(@PathVariable("statusId") String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get status Id : " + statusId);
        }
        return timelineService.getStatus(statusId);
    }

    /**
     * GET  /statuses/home_timeline -> get the latest status from the current user
     */
    @RequestMapping(value = "/rest/statuses/home_timeline",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Status> listStatus(@RequestParam(required = false) Integer count,
                                         @RequestParam(required = false) String since_id,
                                         @RequestParam(required = false) String max_id) {
        if (count == null || count == 0) {
            count = 20; //Default value
        }
        if (log.isDebugEnabled()) {
            log.debug("REST request to get the status list (" + count + " sized).");
        }
        return timelineService.getTimeline(count, since_id, max_id);
    }

    /**
     * GET  /statuses/user_timeline?screen_name=jdubois -> get the latest status from user "jdubois"
     */
    @RequestMapping(value = "/rest/statuses/user_timeline",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Status> listStatusForUser(@RequestParam("screen_name") String username,
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
