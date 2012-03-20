package fr.ippon.tatami.web.rest;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

import java.util.Collection;

import javax.inject.Inject;

import lombok.extern.apachecommons.CommonsLog;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.service.TimelineService;

/**
 * REST controller for managing tweets.
 * 
 * @author Julien Dubois
 */
@Controller
@CommonsLog
public class TweetController {

    @Inject
    private TimelineService timelineService;

    @RequestMapping(value = "/rest/tweets/{login}/{nbTweets}", method = GET, produces = "application/json")
    @ResponseBody
    public Collection<Tweet> listTweets(@PathVariable("login") String login, @PathVariable("nbTweets") String nbTweets) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get the tweet list (" + nbTweets + " sized).");
        }
        try {
            return timelineService.getTimeline(login, Integer.parseInt(nbTweets));
        } catch (NumberFormatException e) {
            log.warn("Page size undefined ; sizing to default", e);
            return timelineService.getTimeline(login, 20);
        }
    }

    @RequestMapping(value = "/rest/ownTweets/{login}", method = GET, produces = "application/json")
    @ResponseBody
    public Collection<Tweet> listTweets(@PathVariable("login") String login) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get the own tweet list (" + login + ").");
        }
        return timelineService.getUserline(login, 20);
    }

    @RequestMapping(value = "/rest/tweets", method = POST)
    public void postTweet(@RequestBody String content) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to add tweet : " + content);
        }
        timelineService.postTweet(content);
    }
}
