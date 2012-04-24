package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.DayTweetStat;
import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.UserTweetStat;
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
    public Collection<UserTweetStat> listDayTweetStats() {
        log.debug("REST request to get the users stats.");

        String date = null;    //TODO parameterized version
        Collection<Tweet> tweets = timelineService.getDayline(date);
        return this.extractUsersTweetStats(tweets, null);
    }

    private Collection<UserTweetStat> extractUsersTweetStats(Collection<Tweet> tweets, Set<String> usersCollector) {
        if (log.isDebugEnabled()) {
            log.debug("analysing " + tweets.size() + " items...");
        }
        Map<String, Integer> users = new HashMap<String, Integer>();
        for (Tweet tweet : tweets) {
            Integer count = users.get(tweet.getLogin());
            if (count != null) {
                count = count.intValue() + 1;
            } else {
                if (usersCollector != null) usersCollector.add(tweet.getLogin());
                count = 1;
            }
            users.put(tweet.getLogin(), count);
        }
        if (log.isDebugEnabled()) {
            log.debug("fetched total of " + users.size() + " stats.");
        }

        Collection<UserTweetStat> stats = new TreeSet<UserTweetStat>();    // cf. UserTweetStat#compareTo
        for (Entry<String, Integer> entry : users.entrySet()) {
            stats.add(new UserTweetStat(entry.getKey(), entry.getValue()));
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
    public Collection<DayTweetStat> listWeekTweetStats() {
        log.debug("REST request to get the users stats.");

        Calendar date = Calendar.getInstance();    //TODO parameterized version
        DayTweetStat stats[] = new DayTweetStat[7];
        Set<String> users = new HashSet<String>();
        for (int i = stats.length; i > 0; i--) {
            date.add(Calendar.DATE, -1);    // let's analyze the past week

            DayTweetStat dayStat = new DayTweetStat(date.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.SHORT, Locale.ENGLISH));
            log.debug("Scanning " + dayStat.getDay() + "...");
            Collection<Tweet> tweets = timelineService.getDayline(date.getTime());
            dayStat.setStats(this.extractUsersTweetStats(tweets, users));

            stats[i - 1] = dayStat;    // oldest first
        }
        this.enforceUsers(stats, users);    // each day's users list has to be identical to the others

        return Arrays.asList(stats);
    }

    private void enforceUsers(DayTweetStat stats[], Set<String> allUsers) {
        for (DayTweetStat stat : stats) {
            for (String login : allUsers) {
                if (!stat.getStats().contains(new UserTweetStat(login, 0))) {    // cf. UserTweetStat#compareTo
                    stat.getStats().add(new UserTweetStat(login, 0));
                }
            }
        }
    }
}
