package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Metered;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.dto.StatusDTO;
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
     * GET  /favorites -> get the favorite status of the current user
     */
    @RequestMapping(value = "/rest/favorites",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Metered
    public Collection<StatusDTO> listFavoriteStatus() {
        if (log.isDebugEnabled()) {
            log.debug("REST request to get the favorite status of the current user.");
        }
        return timelineService.getFavoritesline();
    }

    /**
     * POST /favorites/create/:id -> Favorites the status
     */
    @RequestMapping(value = "/rest/favorites/create/{statusId}",
            method = RequestMethod.POST)
    @ResponseBody
    public void favoriteStatus(@PathVariable("statusId") String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to like status : " + statusId);
        }
        timelineService.addFavoriteStatus(statusId);
    }

    /**
     * POST /favorites/destroy/:id -> Unfavorites the status
     */
    @RequestMapping(value = "/rest/favorites/destroy/{statusId}",
            method = RequestMethod.POST)
    @ResponseBody
    public void unfavoriteStatus(@PathVariable("statusId") String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("REST request to unlike status : " + statusId);
        }
        timelineService.removeFavoriteStatus(statusId);
    }

}
