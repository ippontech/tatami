package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Metered;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.SearchService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.TrendService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.dto.StatusDTO;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.SearchResults;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Search engine controller.
 */
@Controller
public class SearchController {

    private final Log log = LogFactory.getLog(SearchController.class);

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private SearchService searchService;

    @Inject
    private TimelineService timelineService;

    @Inject
    private UserService userService;

    @Inject
    private TrendService trendService;

    /**
     * GET  /search/all?q=tatami -> search users, tags, groups for "tatami"
     */
    @RequestMapping(value = "/rest/search/all",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Metered
    public SearchResults search(@RequestParam(value = "q", required = false, defaultValue = "") String q) {
        SearchResults searchResults = new SearchResults();
        searchResults.setTags(this.searchRecentTags(q));
        searchResults.setUsers(this.searchUsers(q));
        searchResults.setGroups(this.searchGroups(q));
        return searchResults;
    }


    /**
     * GET  /search/status?q=tatami -> get the status where "tatami" appears
     */
    @RequestMapping(value = "/rest/search/status",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Metered
    public Collection<StatusDTO> listStatusForUser(@RequestParam(value = "q", required = false, defaultValue = "") String query,
                                                   @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
                                                   @RequestParam(value = "rpp", required = false, defaultValue = "20") Integer rpp) {

        if (log.isDebugEnabled()) {
            log.debug("REST request to search status containing these words (" + query + ").");
        }
        final User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Map<String, SharedStatusInfo> line;
        if (query != null && !query.equals("")) {
            line = searchService.searchStatus(domain, query, page, rpp);
        } else {
            line = new HashMap<String, SharedStatusInfo>();
        }
        return timelineService.buildStatusList(line);
    }


    /**
     * GET  /search/tags" -> search tags<br>
     *
     * @return a Collection of tags matching the query
     */
    @RequestMapping(value = "/rest/search/tags",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Metered
    public Collection<String> searchRecentTags(@RequestParam("q") String query) {
        String prefix = query.toLowerCase();
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        String domain = DomainUtil.getDomainFromLogin(currentLogin);
        Collection<String> tags;
        if (query != null && !query.equals("")) {
            if (this.log.isDebugEnabled()) {
                this.log.debug("REST request to find tags starting with : " + prefix);
            }
            tags = trendService.searchTags(domain, prefix, 5);
        } else {
            tags = new ArrayList<String>();
        }
        return tags;
    }

    /**
     * GET  /search/groups" -> search groups<br>
     *
     * @return a Collection of groups matching the query
     */
    @RequestMapping(value = "/rest/search/groups",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Metered
    public Collection<Group> searchGroups(@RequestParam("q") String query) {
        String prefix = query.toLowerCase();
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        String domain = DomainUtil.getDomainFromLogin(currentLogin);
        Collection<Group> groups;
        if (query != null && !query.equals("")) {
            if (this.log.isDebugEnabled()) {
                this.log.debug("REST request to find groups starting with : " + prefix);
            }
            groups = searchService.searchGroupByPrefix(domain, prefix, 5);
        } else {
            groups = new ArrayList<Group>();
        }
        return groups;
    }

    /**
     * GET  /search/users" -> search user by username<br>
     * Should return a collection of users matching the query.<br>
     * The collection doesn't contain the current user even if he matches the query.<br>
     * If nothing matches, an empty collection (but not null) is returned.<br>
     *
     * @param query the query
     * @return a Collection of User
     */
    @RequestMapping(value = "/rest/search/users",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Metered
    public Collection<User> searchUsers(@RequestParam("q") String query) {
        String prefix = query.toLowerCase();
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to find users starting with : " + prefix);
        }
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Collection<String> logins = searchService.searchUserByPrefix(domain, prefix);
        return userService.getUsersByLogin(logins);
    }

}
