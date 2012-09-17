package fr.ippon.tatami.web.rest;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.SearchService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.util.DomainUtil;

/**
 * @author dmartin
 */
@Controller
public class SearchController {

    private final Log log = LogFactory.getLog(SearchController.class);

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private SearchService searchService;

    @Inject
    @Named("elasticsearchActivated")
    private boolean elasticsearchActivated;

    @Inject
    private TimelineService timelineService;

    /**
     * GET  /searchStatus/?q=tatami -> get the status where "tatami" appears
     */
    @RequestMapping(value = "/rest/search",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Status> listStatusForUser(@RequestParam(value = "q", required = false, defaultValue = "") String q,
            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(value = "rpp", required = false, defaultValue = "20") Integer rpp) {

        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to search status containing these words (" + q + ").");
        }
        final User currentUser = this.authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Map<String, SharedStatusInfo> line;
        if (q != null && !q.equals("")) {
            line = this.searchService.searchStatus(domain, Jsoup.clean(q, Whitelist.none()), page, rpp);
        } else {
            line = new HashMap<String, SharedStatusInfo>();
        }
        return this.timelineService.buildStatusList(line);
    }

}
