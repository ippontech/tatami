package fr.ippon.tatami.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.repository.DaylineRepository;
import fr.ippon.tatami.repository.DiscussionRepository;
import fr.ippon.tatami.repository.FollowerRepository;
import fr.ippon.tatami.repository.StatusRepository;
import fr.ippon.tatami.repository.TaglineRepository;
import fr.ippon.tatami.repository.TimelineRepository;
import fr.ippon.tatami.repository.UserTagCounterRepository;
import fr.ippon.tatami.repository.UserTagRepository;
import fr.ippon.tatami.repository.UserlineRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.util.DomainUtil;

@Service
public class StatusUpdateService {

    private final Log log = LogFactory.getLog(StatusUpdateService.class);

    private final static Pattern PATTERN_LOGIN = Pattern.compile("@[^\\s]+");
    private static final Pattern HASHTAG_PATTERN = Pattern.compile("#(\\w+)");

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private DaylineRepository daylineRepository;

    @Inject
    private StatusRepository statusRepository;

    @Inject
    private TimelineRepository timelineRepository;

    @Inject
    private UserlineRepository userlineRepository;

    @Inject
    private TaglineRepository taglineRepository;

    @Inject
    private DiscussionRepository discussionRepository;

    @Inject
    private CounterRepository counterRepository;

    @Inject
    private SearchService searchService;

    @Inject
    private UserTagRepository userTagRepository;
    
    @Inject
    private UserTagCounterRepository userTagCounterRepository;


    public void postStatus(String content) {
        createStatus(content, "", "");
    }

    public void replyToStatus(String content, String replyTo) {
        Status originalStatus = statusRepository.findStatusById(replyTo);
        if (!originalStatus.getReplyTo().equals("")) {
            log.debug("Original status is also a reply, replying to the real original status instead.");
            Status realOriginalStatus = statusRepository.findStatusById(originalStatus.getReplyTo());
            Status replyStatus = createStatus(content, realOriginalStatus.getStatusId(), originalStatus.getUsername());
            discussionRepository.addReplyToDiscussion(realOriginalStatus.getStatusId(), replyStatus.getStatusId());
        } else {
        	Status replyStatus = createStatus(content, replyTo, originalStatus.getUsername());
            discussionRepository.addReplyToDiscussion(originalStatus.getStatusId(), replyStatus.getStatusId());
        }
    }

    private Status createStatus(String content, String replyTo, String replyToUsername) {
        if (log.isDebugEnabled()) {
            log.debug("Creating new status : " + content);
        }
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        String username = DomainUtil.getUsernameFromLogin(currentLogin);
        String domain = DomainUtil.getDomainFromLogin(currentLogin);
        List<String> tags = extractTags(content);
        Status status =
                statusRepository.createStatus(currentLogin, username, domain, content, replyTo, replyToUsername, tags);

        // add status to the dayline, userline, timeline, tagline
        String day = StatsService.DAYLINE_KEY_FORMAT.format(status.getStatusDate());
        daylineRepository.addStatusToDayline(status, domain, day);
        userlineRepository.addStatusToUserline(status);
        timelineRepository.addStatusToTimeline(currentLogin, status);
        taglineRepository.addStatusToTagline(status, domain);
        
        if (! tags.isEmpty()) {
	        userTagRepository.addTagsToUserTag(domain, currentLogin, tags);
	        userTagCounterRepository.addTagsToUserTagCounter(currentLogin, tags);
        }

        // add status to the follower's timelines
        Collection<String> followersForUser = followerRepository.findFollowersForUser(currentLogin);
        for (String followerLogin : followersForUser) {
            timelineRepository.addStatusToTimeline(followerLogin, status);
        }

        // add status to the mentioned users' timeline
        Matcher m = PATTERN_LOGIN.matcher(status.getContent());
        while (m.find()) {
            String mentionedUsername = extractUsernameWithoutAt(m.group());
            if (mentionedUsername != null &&
                    !mentionedUsername.equals(currentLogin) &&
                    !followersForUser.contains(mentionedUsername)) {

                if (log.isDebugEnabled()) {
                    log.debug("Mentionning : " + mentionedUsername);
                }
                String mentionedLogin =
                        DomainUtil.getLoginFromUsernameAndDomain(mentionedUsername, domain);

                timelineRepository.addStatusToTimeline(mentionedLogin, status);
            }
        }

        // Increment status count for the current user
        counterRepository.incrementStatusCounter(currentLogin);

        // Add to the searchStatus engine
        searchService.addStatus(status);

        return status;
    }

    private String extractUsernameWithoutAt(String dest) {
        return dest.substring(1, dest.length());
    }
    
    private List<String> extractTags(String content) {
    	List<String> tags = new ArrayList<String>();
    	if (content == null || content.isEmpty()) {
    		return tags;
    	}

        Matcher m = HASHTAG_PATTERN.matcher(content);
        while (m.find()) {
            String tag = m.group(1);
            
            if (tag != null && !tag.isEmpty() && !tag.contains("#")) {
            	tags.add(tag.toLowerCase());
            }
        }

    	
    	return tags;
    }
}
