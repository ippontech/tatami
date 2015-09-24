package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Timed;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.TrendService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.Trend;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import java.util.List;

/**
 * REST controller for managing trends.
 *
 * @author Julien Dubois
 */
@Controller
public class TrendController {

    private final Logger log = LoggerFactory.getLogger(TrendController.class);

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private TrendService trendService;

    /**
     * GET  /trends -> get the tag trends
     */
    @RequestMapping(value = "/rest/trends",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public List<Trend> getTrends() {

        String currentLogin = authenticationService.getCurrentUser().getLogin();
        String domain = DomainUtil.getDomainFromLogin(currentLogin);
        return trendService.getCurrentTrends(domain);
    }

    /**
     * GET  /users/trends ->  get the user trends
     */
    @RequestMapping(value = "/rest/user/trends",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public List<Trend> getUserTrends(@RequestParam("screen_name") String username) {
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        String domain = DomainUtil.getDomainFromLogin(currentLogin);
        return trendService.getTrendsForUser(DomainUtil.getLoginFromUsernameAndDomain(username, domain));
    }
}
