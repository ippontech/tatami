package fr.ippon.tatami.web.rest;

import java.util.Collection;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.ippon.tatami.service.TagMembershipService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.dto.StatusDTO;
import fr.ippon.tatami.web.rest.dto.Tag;

/**
 * REST controller for managing tags.
 *
 * @author Julien Dubois
 */
@Controller
public class TagController {

    private final Log log = LogFactory.getLog(TagController.class);

    @Inject
    private TimelineService timelineService;

    @Inject
    private TagMembershipService tagMembershipService;

    /**
     * GET  /tags -> get the latest status with no tags
     */
    @RequestMapping(value = "/rest/tags/",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<StatusDTO> listStatusWithNoTag(@RequestParam(required = false) Integer count,
                                                  @RequestParam(required = false) String since_id,
                                                  @RequestParam(required = false) String max_id) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get statuses with no tags");
        }
        if (count == null) {
            count = 20;
        }
        try {
            return timelineService.getTagline(null, count, since_id, max_id);
        } catch (NumberFormatException e) {
            log.warn("Page size undefined ; sizing to default", e);
            return timelineService.getTagline(null, 20, since_id, max_id);
        }
    }

    /**
     * GET  /statuses/tag_timeline -> get the latest status for a given tag
     */
    @RequestMapping(value = "/rest/statuses/tag_timeline",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<StatusDTO> listStatusForTag(@RequestParam(required = false, value = "tag") String tag,
                                                   @RequestParam(required = false) Integer count,
                                                   @RequestParam(required = false) String since_id,
                                                   @RequestParam(required = false) String max_id) {

        if (log.isDebugEnabled()) {
            log.debug("REST request to get statuses for tag : " + tag);
        }
        if (count == null) {
            count = 20;
        }
        try {
            return timelineService.getTagline(tag, count, since_id, max_id);
        } catch (NumberFormatException e) {
            log.warn("Page size undefined ; sizing to default", e);
            return timelineService.getTagline(tag, 20, since_id, max_id);
        }
    }

    /**
     * POST /tagmemberships/create -> follow tag
     */
    @RequestMapping(value = "/rest/tagmemberships/create",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    public void followTag(@RequestBody Tag tag) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to follow tag : " + tag);
        }
        tagMembershipService.followTag(tag);
    }

    /**
     * POST /tagmemberships/destroy -> unfollow tag
     */
    @RequestMapping(value = "/rest/tagmemberships/destroy",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    public void unfollowTag(Tag tag) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to unfollow tag  : " + tag);
        }
        tagMembershipService.unfollowTag(tag);
    }
}
