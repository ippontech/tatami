package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.DayStatusStat;
import fr.ippon.tatami.domain.Status;
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
import java.util.Map.Entry;

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

        String date = null;    //TODO parameterized version
        Collection<Status> statuses = timelineService.getDayline(date);
        return this.extractUsersStatusStats(statuses, null);
    }

    private Collection<UserStatusStat> extractUsersStatusStats(Collection<Status> statuses, Set<String> usersCollector) {
        if (log.isDebugEnabled()) {
            log.debug("analysing " + statuses.size() + " items...");
        }
        Map<String, Integer> users = new HashMap<String, Integer>();
        for (Status status : statuses) {
            Integer count = users.get(status.getLogin());
            if (count != null) {
                count = count.intValue() + 1;
            } else {
                if (usersCollector != null) usersCollector.add(status.getLogin());
                count = 1;
            }
            users.put(status.getLogin(), count);
        }
        if (log.isDebugEnabled()) {
            log.debug("fetched total of " + users.size() + " stats.");
        }

        Collection<UserStatusStat> stats = new TreeSet<UserStatusStat>();    // cf. UserStatusStat#compareTo
        for (Entry<String, Integer> entry : users.entrySet()) {
            stats.add(new UserStatusStat(entry.getKey(), entry.getValue()));
        }
        return stats;
    }

    /**
     * GET  /stats/week -> statistics for this week
     */
    @RequestMapping(value = "/rest/stats/week",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<DayStatusStat> listWeekStatusStats() {
        log.debug("REST request to get the users stats.");

        Calendar date = Calendar.getInstance();    //TODO parameterized version
        DayStatusStat stats[] = new DayStatusStat[7];
        Set<String> users = new HashSet<String>();
        for (int i = stats.length; i > 0; i--) {
            date.add(Calendar.DATE, -1);    // let's analyze the past week

            DayStatusStat dayStat = new DayStatusStat(date.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.SHORT, Locale.ENGLISH));
            log.debug("Scanning " + dayStat.getDay() + "...");
            Collection<Status> statuses = timelineService.getDayline(date.getTime());
            dayStat.setStats(this.extractUsersStatusStats(statuses, users));

            stats[i - 1] = dayStat;    // oldest first
        }
        this.enforceUsers(stats, users);    // each day's users list has to be identical to the others

        return Arrays.asList(stats);
    }

    private void enforceUsers(DayStatusStat stats[], Set<String> allUsers) {
        for (DayStatusStat stat : stats) {
            for (String login : allUsers) {
                if (!stat.getStats().contains(new UserStatusStat(login, 0))) {    // cf. UserStatusStat#compareTo
                    stat.getStats().add(new UserStatusStat(login, 0));
                }
            }
        }
    }
}
