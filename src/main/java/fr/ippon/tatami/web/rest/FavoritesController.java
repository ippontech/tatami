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
 * REST controller for managing favorites.
 *
 * @author Julien Dubois
 */
@Controller
public class FavoritesController {

    private final Log log = LogFactory.getLog(FavoritesController.class);

    @Inject
    private TimelineService timelineService;

    /**
     * GET  /favorites -> get the favorite tweets of the current user
     */
    @RequestMapping(value = "/rest/favorites",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Tweet> listFavoriteTweets() {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get the favorite tweets of the current user.");
        }
        return timelineService.getFavoritesline();
    }

    /**
     * POST /favorites/create/:id -> Favorites the tweet
     */
    @RequestMapping(value = "/rest/favorites/create/{tweetId}",
            method = RequestMethod.POST)
    @ResponseBody
    public void favoriteTweet(@PathVariable("tweetId") String tweetId) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to like tweet : " + tweetId);
        }
        timelineService.addFavoriteTweet(tweetId);
    }
    
    /**
     * POST /favorites/remove/:id -> Unfavorites the tweet
     */
    @RequestMapping(value = "/rest/favorites/remove/{tweetId}",
            method = RequestMethod.POST)
    @ResponseBody
    public void unfavoriteTweet(@PathVariable("tweetId") String tweetId) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to unlike tweet : " + tweetId);
        }
        timelineService.removeFavoriteTweet(tweetId);
    }

}
