package fr.ippon.tatami.web.rest;

import java.util.Collection;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.TrendService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.Trend;

/**
 * REST controller for managing trends.
 *
 * @author Julien Dubois
 */
@Controller
public class TrendController {

    private final Log log = LogFactory.getLog(TrendController.class);

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private TrendService trendService;

    /**
     * GET  /tags -> get the latest status with no tags
     */
    @RequestMapping(value = "/rest/trends",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public List<Trend> getTrends() {

        String currentLogin = authenticationService.getCurrentUser().getLogin();
        String domain = DomainUtil.getDomainFromLogin(currentLogin);
        return trendService.getCurrentTrends(domain);
    }

    /**
     * GET  /users/trends -> 
     */
    @RequestMapping(value = "/rest/user/trends",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public List<Trend> getUserTrends(@RequestParam("screen_name") String username) {

        String currentLogin = authenticationService.getCurrentUser().getLogin();
        String domain = DomainUtil.getDomainFromLogin(currentLogin);
        return trendService.getTrendsForUser(DomainUtil.getLoginFromUsernameAndDomain(username, domain));
    }

    /**
     * @return a Collection of a user's domain tags matching the query
     */
    @RequestMapping(value = "/rest/user/last-trends",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<String> searchRecentTags(@RequestParam("q") String query) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to find tags");
        }
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        String domain = DomainUtil.getDomainFromLogin(currentLogin);

        return trendService.searchTags(domain, query);
    }
}
