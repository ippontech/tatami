package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.UserStatusStat;
import fr.ippon.tatami.service.StatsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import java.util.Collection;

/**
 * REST controller for managing stats.
 *
 * @author Julien Dubois
 */
@Controller
public class StatsController {

    private final Logger log = LoggerFactory.getLogger(StatsController.class);

    @Inject
    private StatsService statsService;

    /**
     * GET  /stats/day -> statistics for today
     */
    @RequestMapping(value = "/rest/stats/day",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<UserStatusStat> listDayStatusStats() {
        log.debug("REST request to get the users stats.");
        return statsService.getDayline();
    }
}
