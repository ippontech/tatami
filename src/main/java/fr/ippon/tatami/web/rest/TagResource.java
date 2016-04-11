package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.repository.UserTagRepository;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.security.UserDetailsService;
import fr.ippon.tatami.service.TagMembershipService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.TrendService;
import fr.ippon.tatami.service.UserService;
//import fr.ippon.tatami.service.dto.StatusDTO;
//import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.TagDTO;
import fr.ippon.tatami.web.rest.dto.TrendDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import fr.ippon.tatami.web.rest.dto.StatusDTO;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/tatami")
public class TagResource {

    private final Logger log = LoggerFactory.getLogger(TagResource.class);

    @Inject
    private TimelineService timelineService;

    @Inject
    private TagMembershipService tagMembershipService;

    @Inject
    private TrendService trendService;

    @Inject
    private UserTagRepository userTagRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserDetailsService userDetailsService;

//    @Inject
//    private Authentication authenticationService;

    @Inject
    private UserService userService;

    /**
     * GET  /rest/tags/{tagName}/tag_timeline -> get the latest status for a given tag
     */
    @RequestMapping(value = "/rest/tags/{tagName}/tag_timeline",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<StatusDTO> listStatusForTag(@PathVariable String tagName,
                                                  @RequestParam(required = false) Integer count,
                                                  @RequestParam(required = false) String start,
                                                  @RequestParam(required = false) String finish) {

        log.debug("REST request to get statuses for tag : {}", tagName);
        if (count == null) {
            count = 20;
        }
        try {
            return timelineService.getTagline(tagName, count, start, finish);
        } catch (NumberFormatException e) {
            log.warn("Page size undefined ; sizing to default", e);
            return timelineService.getTagline(tagName, 20, start, finish);
        }
    }

    /**
     * WARNING! This is the old API, only used by the admin console
     * <p/>
     * POST /tagmemberships/create -> follow tag
     */
    @RequestMapping(value = "/rest/tagmemberships/create",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    @Timed
    @Deprecated
    public boolean followTag(@RequestBody TagDTO tag) {
        log.debug("REST request to follow tag : {}", tag);
        return tagMembershipService.followTag(tag);
    }

    /**
     * WARNING! This is the old API, only used by the admin console
     * <p/>
     * POST /tagmemberships/destroy -> unfollow tag
     */
    @RequestMapping(value = "/rest/tagmemberships/destroy",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    @Timed
    @Deprecated
    public boolean unfollowTag(@RequestBody TagDTO tag) {
        log.debug("REST request to unfollow tag  : {}", tag);
        return tagMembershipService.unfollowTag(tag);
    }

    /**
     * POST /tagmemberships/lookup -> looks up the tag for the user
     */
    @RequestMapping(value = "/rest/tagmemberships/lookup",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public TagDTO lookupTag(@RequestParam("tag_name") String tagname) {
        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        Collection<String> followedTags = userTagRepository.findTags(currentUser.getEmail());
        TagDTO tag = new TagDTO();
        tag.setName(tagname);
        if (followedTags.contains(tagname)) {
            tag.setFollowed(true);
        }
        return tag;
    }

    /**
     * GET  /tagmemberships/list -> get the tags followed by the current user
     */
    @RequestMapping(value = "/rest/tagmemberships/list",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<TagDTO> getFollowedTags() {
        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        Collection<String> followedTags = userTagRepository.findTags(currentUser.getEmail());
        Collection<TagDTO> tags = new ArrayList<TagDTO>();
        for (String followedTag : followedTags) {
            TagDTO tag = new TagDTO();
            tag.setName(followedTag);
            tag.setFollowed(true);
            tags.add(tag);
        }
        return tags;
    }

    /**
     * GET  /tags/popular -> get the list of popular tags
     */
    @RequestMapping(value = "/rest/tags/popular",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<TagDTO> getPopularTags() {
        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        String domain = DomainUtil.getDomainFromEmail(currentUser.getEmail());
        List<TrendDTO> trends = trendService.getCurrentTrends(domain);
        Collection<String> followedTags = userTagRepository.findTags(currentUser.getEmail());
        Collection<TagDTO> tags = new ArrayList<TagDTO>();
        for (TrendDTO trend : trends) {
            TagDTO tag = new TagDTO();
            tag.setName(trend.getTag());
            if (followedTags.contains(trend.getTag())) {
                tag.setFollowed(true);
            }
            tags.add(tag);
        }
        return tags;
    }


    @RequestMapping(value = "/rest/tags",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<TagDTO> getTags(@RequestParam(required = false, value = "popular") String popular,
                                   @RequestParam(required = false, value = "user") String username,
                                   @RequestParam(required = false, value = "search") String search) {
        Collection<TagDTO> tags = new ArrayList<TagDTO>();
        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        String domain = DomainUtil.getDomainFromEmail(currentUser.getEmail());
        Collection<String> followedTags = userTagRepository.findTags(currentUser.getEmail());
        Collection<String> tagNames;

        if (popular != null) {
            List<TrendDTO> trends;
            User user = null;
            if (username != null) user = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();

            userRepository
                .findOneByEmail(userDetailsService.getUserEmail());
            if (user != null) {
                trendService.getTrendsForUser(user.getUsername());
                trends = trendService.getTrendsForUser(user.getUsername());
            } else {
                trends = trendService.getCurrentTrends(domain);
            }

            for (TrendDTO trend : trends) {
                TagDTO tag = new TagDTO();
                tag.setName(trend.getTag());
                tag.setTrendingUp(trend.isTrendingUp());
                tags.add(tag);
            }
        } else if (search != null && !search.isEmpty()) {
            String prefix = search.toLowerCase();
            tagNames = trendService.searchTags(domain, prefix, 5);
            for (String tagName : tagNames) {
                TagDTO tag = new TagDTO();
                tag.setName(tagName);
                tags.add(tag);
            }
        } else {
            tagNames = userTagRepository.findTags(currentUser.getEmail());
            for (String tagName : tagNames) {
                TagDTO tag = new TagDTO();
                tag.setName(tagName);
                tags.add(tag);
            }
        }

        for (TagDTO tag : tags) {
            if (followedTags.contains(tag.getName())) {
                tag.setFollowed(true);
            }
        }

        return tags;
    }


    @RequestMapping(value = "/rest/tags/{tag}",
            method = RequestMethod.PUT,
            produces = "application/json")
    @ResponseBody
    @Timed
    public TagDTO updateTag(@RequestBody TagDTO tag) {
        if (tag.isFollowed()) {
            tagMembershipService.followTag(tag);
        } else {
            tagMembershipService.unfollowTag(tag);
        }
        return tag;
    }


    @RequestMapping(value = "/rest/tags/{tag}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public TagDTO getTag(@PathVariable("tag") String tagName) {
        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        Collection<String> followedTags = userTagRepository.findTags(currentUser.getEmail());
        TagDTO tag = new TagDTO();
        tag.setName(tagName);
        if (followedTags.contains(tagName)) {
            tag.setFollowed(true);
        }
        return tag;
    }
}
