package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.Calendar;
import java.util.Collection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class StatusUpdateService {

    private final Log log = LogFactory.getLog(StatusUpdateService.class);

    private final static Pattern PATTERN_LOGIN = Pattern.compile("@[^\\s]+");

    private static final Pattern PATTERN_HASHTAG = Pattern.compile("#(\\w+)");

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private TagFollowerRepository tagFollowerRepository;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private DaylineRepository daylineRepository;

    @Inject
    private StatusRepository statusRepository;

    @Inject
    private TimelineRepository timelineRepository;

    @Inject
    private MentionlineRepository mentionlineRepository;

    @Inject
    private UserlineRepository userlineRepository;

    @Inject
    private TaglineRepository taglineRepository;

    @Inject
    private TagCounterRepository tagCounterRepository;

    @Inject
    private UserGroupRepository userGroupRepository;

    @Inject
    private GrouplineRepository grouplineRepository;

    @Inject
    private TrendRepository trendsRepository;

    @Inject
    private UserTrendRepository userTrendRepository;

    @Inject
    private DiscussionRepository discussionRepository;

    @Inject
    private CounterRepository counterRepository;

    @Inject
    private SearchService searchService;

    public void postStatus(String content) {
        createStatus(content, null, "", "");
    }

    public void postStatusToGroup(String content, Group group) {
        createStatus(content, group, "", "");
    }

    public void replyToStatus(String content, String replyTo) {
        Status originalStatus = statusRepository.findStatusById(replyTo);
        if (!originalStatus.getReplyTo().equals("")) {
            log.debug("Original status is also a reply, replying to the real original status instead.");
            Status realOriginalStatus = statusRepository.findStatusById(originalStatus.getReplyTo());
            Status replyStatus = createStatus(content, null, realOriginalStatus.getStatusId(), originalStatus.getUsername());
            discussionRepository.addReplyToDiscussion(realOriginalStatus.getStatusId(), replyStatus.getStatusId());
        } else {
            Status replyStatus = createStatus(content, null, replyTo, originalStatus.getUsername());
            discussionRepository.addReplyToDiscussion(originalStatus.getStatusId(), replyStatus.getStatusId());
        }
    }

    private Status createStatus(String content, Group group, String replyTo, String replyToUsername) {
        long startTime = 0;
        if (log.isDebugEnabled()) {
            startTime = Calendar.getInstance().getTimeInMillis();
            log.debug("Creating new status : " + content);
        }
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        String username = DomainUtil.getUsernameFromLogin(currentLogin);
        String domain = DomainUtil.getDomainFromLogin(currentLogin);

        Status status =
                statusRepository.createStatus(currentLogin, username, domain, group, content, replyTo, replyToUsername);

        // add status to the timeline
        timelineRepository.addStatusToTimeline(currentLogin, status);

        Collection<String> followersForUser = followerRepository.findFollowersForUser(currentLogin);

        // add status to the dayline, userline
        String day = StatsService.DAYLINE_KEY_FORMAT.format(status.getStatusDate());
        daylineRepository.addStatusToDayline(status, day);
        userlineRepository.addStatusToUserline(status);

        // add the status to the group line and group followers
        if (group != null) {
            grouplineRepository.addStatusToGroupline(status, group.getGroupId());
            //TODO add the status to the group members
        }

        // add status to the follower's timelines
        // only for public groups : if the use belongs to the private group, he will get the status anyway
        if (group == null || group.isPublicGroup()) {
            for (String followerLogin : followersForUser) {
                timelineRepository.addStatusToTimeline(followerLogin, status);
            }
        }

        // tag managgement
        manageStatusTags(status, group);

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

                // If this is a private group, and if the mentioned user is not in the group, he will not see the status
                if (group != null && !group.isPublicGroup()) {
                    Collection<String> groupIds = userGroupRepository.findGroups(mentionedLogin);
                    if (groupIds.contains(group.getGroupId())) { // The user is part of the private group
                        mentionUser(status, mentionedLogin);
                    }
                }  else { // This is a public status
                    mentionUser(status, mentionedLogin);
                }
            }
        }

        // Increment status count for the current user
        counterRepository.incrementStatusCounter(currentLogin);

        // Add to the searchStatus engine
        searchService.addStatus(status);

        if (log.isDebugEnabled()) {
            long finishTime = Calendar.getInstance().getTimeInMillis();
            log.debug("Status created in " + (finishTime - startTime) + "ms.");
        }
        return status;
    }

    /**
     * Parses the status to find tags, and add those tags to the TagLine and the Trends.
     */
    private void manageStatusTags(Status status, Group group) {
        Matcher m = PATTERN_HASHTAG.matcher(status.getContent());
        while (m.find()) {
            String tag = m.group(1);
            if (tag != null && !tag.isEmpty() && !tag.contains("#")) {
                if (log.isDebugEnabled()) {
                    log.debug("Found tag : " + tag);
                }
                taglineRepository.addStatusToTagline(status, tag);
                tagCounterRepository.incrementTagCounter(status.getDomain(), tag);
                trendsRepository.addTag(status.getDomain(), tag);
                userTrendRepository.addTag(status.getLogin(), tag);

                // Add the status to all users following this tag
                addStatusToTagFollowers(status, group, tag);
            }
        }
    }

    private void addStatusToTagFollowers(Status status, Group group, String tag) {
        Collection<String> followersForTag = tagFollowerRepository.findFollowers(status.getDomain(), tag);
        if (group == null || group.isPublicGroup()) { // This is a public status
            for (String followerLogin : followersForTag) {
                timelineRepository.addStatusToTimeline(followerLogin, status);
            }
        } else {  // This is private status
            for (String followerLogin : followersForTag) {
                Collection<String> groupIds = userGroupRepository.findGroups(followerLogin);
                if (groupIds.contains(group.getGroupId())) { // The user is part of the private group
                    timelineRepository.addStatusToTimeline(followerLogin, status);
                }
            }
        }
    }

    /**
     * A status that mention a user is put in the user's mentionline and in his timeline.
     */
    private void mentionUser(Status status, String mentionedLogin) {
        mentionlineRepository.addStatusToMentionline(mentionedLogin, status);
        timelineRepository.addStatusToTimeline(mentionedLogin, status);
    }

    private String extractUsernameWithoutAt(String dest) {
        return dest.substring(1, dest.length());
    }
}
