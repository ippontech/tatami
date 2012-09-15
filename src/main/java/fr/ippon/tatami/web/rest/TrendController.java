package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.Trend;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.TrendService;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
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
}
