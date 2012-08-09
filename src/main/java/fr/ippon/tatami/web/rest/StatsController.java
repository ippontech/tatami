package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.UserStatusStat;
import fr.ippon.tatami.service.TimelineService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import java.util.*;

/**
 * REST controller for managing stats.
 *
 * @author Julien Dubois
 */
@Controller
public class StatsController {

    private final Log log = LogFactory.getLog(StatsController.class);

    @Inject
    private TimelineService timelineService;

    /**
     * GET  /stats/day -> statistics for today
     */
    @RequestMapping(value = "/rest/stats/day",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<UserStatusStat> listDayStatusStats() {
        log.debug("REST request to get the users stats.");
        Collection<UserStatusStat> statuses = timelineService.getDayline();
        return statuses;
    }
}
