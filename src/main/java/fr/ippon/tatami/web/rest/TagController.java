package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.service.TimelineService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import java.util.Collection;

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

    /**
     * GET  /tags -> get the latest tweets with no tags
     */
    @RequestMapping(value = "/rest/tags/{nbTweets}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Tweet> listTagTweets(@PathVariable("nbTweets") String nbTweets) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get a tag tweet list (" + nbTweets + " sized).");
        }
        try {
            return timelineService.getTagline(null, Integer.parseInt(nbTweets));
        } catch (NumberFormatException e) {
            log.warn("Page size undefined ; sizing to default", e);
            return timelineService.getTagline(null, 20);
        }
    }

    /**
     * GET  /tags/ippon -> get the latest tweets tagged with "ippon"
     */
    @RequestMapping(value = "/rest/tags/{tag}/{nbTweets}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Tweet> listTagTweets(@PathVariable("tag") String tag, @PathVariable("nbTweets") String nbTweets) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get a tag tweet list (" + nbTweets + " sized).");
        }
        try {
            return timelineService.getTagline(tag, Integer.parseInt(nbTweets));
        } catch (NumberFormatException e) {
            log.warn("Page size undefined ; sizing to default", e);
            return timelineService.getTagline(tag, 20);
        }
    }
}
