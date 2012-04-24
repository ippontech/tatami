package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.service.TimelineService;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.Collection;

/**
 * REST controller for managing tweets.
 *
 * @author Julien Dubois
 */
@Controller
public class TimelineController {

    private final Log log = LogFactory.getLog(TimelineController.class);

    @Inject
    private TimelineService timelineService;

    /**
     * POST /statuses/update -> create a new Tweet
     */
    @RequestMapping(value = "/rest/statuses/update",
            method = RequestMethod.POST)
    public void postTweet(@RequestBody String content) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to add tweet : " + content);
        }
        String escapedContent = StringEscapeUtils.escapeHtml(content);
        timelineService.postTweet(escapedContent);
    }

    /**
     * POST /statuses/destroy/:id -> delete Tweet
     */
    @RequestMapping(value = "/rest/statuses/destroy/{tweetId}",
            method = RequestMethod.POST)
    @ResponseBody
    public void removeTweet(@PathVariable("tweetId") String tweetId) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to remove tweet : " + tweetId);
        }
        timelineService.removeTweet(tweetId);
    }

    /**
     * GET  /statuses/home_timeline -> get the latest tweets from the current user
     */
    @RequestMapping(value = "/rest/statuses/home_timeline",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Tweet> listTweets(@RequestParam(required = false) Integer count) {
        if (count == null || count == 0) {
            count = 20; //Default value
        }
        if (log.isDebugEnabled()) {
            log.debug("REST request to get the tweet list (" + count + " sized).");
        }
        return timelineService.getTimeline(count);
    }

    /**
     * GET  /statuses/user_timeline?screen_name=jdubois -> get the latest tweets from user "jdubois"
     */
    @RequestMapping(value = "/rest/statuses/user_timeline",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Tweet> listTweetsForUser(@RequestParam("screen_name") String login,
                                               @RequestParam(required = false) Integer count) {

        if (count == null || count == 0) {
            count = 20; //Default value
        }
        if (log.isDebugEnabled()) {
            log.debug("REST request to get someone's tweets (" + login + ").");
        }
        return timelineService.getUserline(login, count);
    }
}
