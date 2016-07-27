package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.repository.UserTagRepository;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.TagMembershipService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.TrendService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.StatusDTO;
import fr.ippon.tatami.web.rest.dto.TagDTO;
import fr.ippon.tatami.web.rest.dto.TrendDTO;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
     * GET  /tags/popular -> get the list of popular tags
     */
    @RequestMapping(value = "/rest/tags/popular",
        method = RequestMethod.GET,
        produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<TagDTO> getPopularTags() {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        String domain = DomainUtil.getDomainFromEmail(userEmail);
        List<TrendDTO> trends = trendService.getCurrentTrends(domain);
        Collection<String> followedTags = userTagRepository.findTags(userEmail);
        return trends.stream().map(trend -> {
            TagDTO tagDTO = new TagDTO();
            tagDTO.setName(trend.getTag());
            tagDTO.setFollowed(followedTags.contains(trend.getTag()));
            return tagDTO;
        }).collect(Collectors.toList());
    }

    @RequestMapping(value = "/rest/tags",
        method = RequestMethod.GET,
        produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<TagDTO> getTags(@RequestParam(required = false, value = "popular") String popular,
                                      @RequestParam(required = false, value = "user") String email,
                                      @RequestParam(required = false, value = "search") String search) {
        Collection<TagDTO> tags = new ArrayList<>();
        String userEmail = SecurityUtils.getCurrentUserEmail();
        String domain = DomainUtil.getDomainFromEmail(userEmail);
        Collection<String> followedTags = userTagRepository.findTags(userEmail);

        if (popular != null) {
            List<TrendDTO> trends;
            Optional<User> userOptional = userRepository.findOneByEmail(email);

            if (userOptional.isPresent()) {
                trends = trendService.getTrendsForUser(userOptional.get().getEmail());
            } else {
                trends = trendService.getCurrentTrends(domain);
            }

            // Add tags build from user's or domain's trends
            trends.forEach(trend -> {
                TagDTO tag = new TagDTO();
                tag.setName(trend.getTag());
                tag.setTrendingUp(trend.isTrendingUp());
                tag.setFollowed(followedTags.contains(tag.getName()));
                tags.add(tag);
            });
        } else if (StringUtils.isNotBlank(search)) {
            String prefix = search.toLowerCase();
            Collection<String> searchTags = trendService.searchTags(domain, prefix, 5);

            // Add tags from search
            searchTags.forEach(tagName -> {
                TagDTO tag = new TagDTO();
                tag.setName(tagName);
                tag.setFollowed(followedTags.contains(tag.getName()));
                tags.add(tag);
            });
        } else {
            // Add tags from current user
            followedTags.forEach(tagName -> {
                TagDTO tag = new TagDTO();
                tag.setName(tagName);
                tag.setFollowed(true);
                tags.add(tag);
            });
        }

        return tags;
    }

    @RequestMapping(value = "/rest/tags",
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
        Collection<String> followedTags = userTagRepository.findTags(SecurityUtils.getCurrentUserEmail());
        TagDTO tag = new TagDTO();
        tag.setName(tagName);
        tag.setFollowed(followedTags.contains(tagName));
        return tag;
    }
}
