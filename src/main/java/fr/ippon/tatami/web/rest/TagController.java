package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserTagRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.TagMembershipService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.TrendService;
import fr.ippon.tatami.service.dto.StatusDTO;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.Tag;
import fr.ippon.tatami.web.rest.dto.Trend;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

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

    @Inject
    private TrendService trendService;

    @Inject
    private UserTagRepository userTagRepository;

    @Inject
    private AuthenticationService authenticationService;

    /**
     * GET  /tags -> get the tags list
     */
    @RequestMapping(value = "/rest/tags",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Tag> getTags() {
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        List<Trend> trends = trendService.getCurrentTrends(domain);
        Collection<String> followedTags = userTagRepository.findTags(currentUser.getLogin());
        Collection<Tag> tags = new ArrayList<Tag>();
        for (Trend trend : trends) {
            Tag tag = new Tag();
            tag.setName(trend.getTag());
            if (followedTags.contains(trend.getTag())) {
                tag.setFollowed(true);
            }
            tags.add(tag);
        }
        return tags;
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
    public void unfollowTag(@RequestBody Tag tag) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to unfollow tag  : " + tag);
        }
        tagMembershipService.unfollowTag(tag);
    }

    /**
     * POST /tagmemberships/lookup -> looks up the tag for the user
     */
    @RequestMapping(value = "/rest/tagmemberships/lookup",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Tag lookupTag(@RequestParam("tag_name") String tagname) {
        User currentUser = authenticationService.getCurrentUser();
        Collection<String> followedTags = userTagRepository.findTags(currentUser.getLogin());
        Tag tag = new Tag();
        tag.setName(tagname);
        if (followedTags.contains(tagname)) {
            tag.setFollowed(true);
        }
        return tag;
    }
}
