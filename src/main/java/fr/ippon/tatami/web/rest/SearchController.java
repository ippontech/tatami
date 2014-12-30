package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Timed;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserTagRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.*;
import fr.ippon.tatami.service.dto.StatusDTO;
import fr.ippon.tatami.service.dto.UserDTO;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.SearchResults;
import fr.ippon.tatami.web.rest.dto.Tag;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Search engine controller.
 */
@Controller
public class SearchController {

    private final Logger log = LoggerFactory.getLogger(SearchController.class);

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private SearchService searchService;

    @Inject
    private TimelineService timelineService;

    @Inject
    private UserService userService;

    @Inject
    private GroupService groupService;

    @Inject
    private TrendService trendService;

    @Inject
    private UserTagRepository userTagRepository;

    /**
     * GET  /search/all?q=tatami -> search users, tags, groups for "tatami"
     */
    @RequestMapping(value = "/rest/search/all",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
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
    @Timed
    public Collection<StatusDTO> listStatusForUser(@RequestParam(value = "q", required = false, defaultValue = "") String query,
                                                   @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
                                                   @RequestParam(value = "rpp", required = false, defaultValue = "20") Integer rpp) {

        log.debug("REST request to search status containing these words ({}).", query);
        final User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        List<String> line;
        if (StringUtils.isNotBlank(query)) {
            line = searchService.searchStatus(domain, query, page, rpp);
        } else {
            line = Collections.emptyList();
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
    @Timed
    public Collection<Tag> searchRecentTags(@RequestParam("q") String query) {
        String prefix = query.toLowerCase();
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        String domain = DomainUtil.getDomainFromLogin(currentLogin);
        Collection<String> followedTags = userTagRepository.findTags(currentLogin);
        Collection<String> trends = trendService.searchTags(domain, prefix, 5);
        Collection<Tag> tags = new ArrayList<Tag>();

        if (query != null && !query.equals("")) {
            this.log.debug("REST request to find tags starting with : {}", prefix);
            for (String trend : trends) {
                Tag tag = new Tag();
                tag.setName(trend);
                if (followedTags.contains(trend)) {
                    tag.setFollowed(true);
                }
                tags.add(tag);
            }

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
    @Timed
    public Collection<Group> searchGroups(@RequestParam("q") String query) {
        String prefix = query.toLowerCase();
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        String domain = DomainUtil.getDomainFromLogin(currentLogin);
        Collection<Group> groups;
        if (query != null && !query.equals("")) {
            this.log.debug("REST request to find groups starting with : {}", prefix);
            groups = searchService.searchGroupByPrefix(domain, prefix, 5);
        } else {
            groups = new ArrayList<Group>();
        }
        return groupService.buildGroupList(groups);
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
    @Timed
    public Collection<UserDTO> searchUsers(@RequestParam("q") String query) {
        String prefix = query.toLowerCase();

        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Collection<String> logins = searchService.searchUserByPrefix(domain, prefix);
        Collection<User> users;

        if (query != null && !query.equals("")) {
            this.log.debug("REST request to find users starting with : {}", prefix);
            users = userService.getUsersByLogin(logins);
        } else {
            users = new ArrayList<User>();
        }
        return userService.buildUserDTOList(users);

    }

}
