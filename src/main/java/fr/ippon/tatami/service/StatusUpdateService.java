package fr.ippon.tatami.service;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.status.AbstractStatus;
import fr.ippon.tatami.domain.status.Share;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.domain.status.StatusType;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.exception.ArchivedGroupException;
import fr.ippon.tatami.service.exception.ReplyStatusException;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class StatusUpdateService {

    private static final Log log = LogFactory.getLog(StatusUpdateService.class);

    private static final Pattern PATTERN_LOGIN = Pattern.compile("@[^\\s]+");

    private static final Pattern PATTERN_HASHTAG = Pattern.compile("(^|\\s)#([^\\s !\"#$%&\'()*+,./:;<=>?@\\\\\\[\\]^_`{|}~-]+)");

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
    private GroupMembersRepository groupMembersRepository;

    @Inject
    private GroupService groupService;

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

    @Inject
    private MailService mailService;

    @Inject
    private UserRepository userRepository;

    @Inject
    private DomainlineRepository domainlineRepository;

    @Inject
    private StatusAttachmentRepository statusAttachmentRepository;

    @Inject
    private NotificationService notificationService;

    public void postStatus(String content, boolean statusPrivate, Collection<String> attachmentIds) {
        createStatus(content, statusPrivate, null, "", "", "", attachmentIds, null);
    }

    public void postStatusToGroup(String content, Group group, Collection<String> attachmentIds) {
        createStatus(content, false, group, "", "", "", attachmentIds, null);
    }

    public void postStatusAsUser(String content, User user) {
        createStatus(content, false, null, "", "", "", null, user);
    }

    public void replyToStatus(String content, String replyTo) throws ArchivedGroupException, ReplyStatusException {
        AbstractStatus abstractStatus = statusRepository.findStatusById(replyTo);
        if (abstractStatus != null &&
                !abstractStatus.getType().equals(StatusType.STATUS) &&
                !abstractStatus.getType().equals(StatusType.SHARE)) {

            log.debug("Can not reply to a status of this type");
            throw new ReplyStatusException();
        }
        if (abstractStatus != null &&
                abstractStatus.getType().equals(StatusType.SHARE)) {

            log.debug("Replacing the share by the original status");
            Share share = (Share) abstractStatus;
            AbstractStatus abstractRealStatus = statusRepository.findStatusById(share.getOriginalStatusId());
            abstractStatus = abstractRealStatus;
        }

        Status status = (Status) abstractStatus;
        Group group = null;
        if (status.getGroupId() != null) {
            group = groupService.getGroupById(status.getDomain(), status.getGroupId());

            if (group.isArchivedGroup()) {
                throw new ArchivedGroupException();
            }
        }
        if (!status.getReplyTo().equals("")) {
            log.debug("Replacing the status by the status at the origin of the disucssion");
            // Original status is also a reply, replying to the real original status instead
            AbstractStatus abstractRealOriginalStatus = statusRepository.findStatusById(status.getDiscussionId());
            if (abstractRealOriginalStatus == null ||
                    !abstractRealOriginalStatus.getType().equals(StatusType.STATUS)) {

                throw new ReplyStatusException();
            }
            Status realOriginalStatus = (Status) abstractRealOriginalStatus;

            Status replyStatus = createStatus(
                    content,
                    realOriginalStatus.getStatusPrivate(),
                    group,
                    realOriginalStatus.getStatusId(),
                    status.getStatusId(),
                    status.getUsername());

            discussionRepository.addReplyToDiscussion(realOriginalStatus.getStatusId(), replyStatus.getStatusId());
        } else {
            log.debug("Replying directly to the status at the origin of the disucssion");
            // The original status of the discussion is the one we reply to
            Status replyStatus =
                    createStatus(content,
                            status.getStatusPrivate(),
                            group,
                            status.getStatusId(),
                            status.getStatusId(),
                            status.getUsername());

            discussionRepository.addReplyToDiscussion(status.getStatusId(), replyStatus.getStatusId());
        }
    }

    private Status createStatus(String content,
                                boolean statusPrivate,
                                Group group,
                                String discussionId,
                                String replyTo,
                                String replyToUsername) {

        return createStatus(
                content,
                statusPrivate,
                group,
                discussionId,
                replyTo,
                replyToUsername,
                new ArrayList<String>(),
                null);
    }

    private Status createStatus(String content,
                                boolean statusPrivate,
                                Group group,
                                String discussionId,
                                String replyTo,
                                String replyToUsername,
                                Collection<String> attachmentIds,
                                User user) {

        content = StringEscapeUtils.unescapeHtml(content);
        long startTime = 0;
        if (log.isInfoEnabled()) {
            startTime = Calendar.getInstance().getTimeInMillis();
            if (log.isDebugEnabled()) {
                log.debug("Creating new status : " + content);
            }
        }
        String currentLogin;
        if (user == null) {
            currentLogin = authenticationService.getCurrentUser().getLogin();
        } else {
            currentLogin = user.getLogin();
        }
        String domain = DomainUtil.getDomainFromLogin(currentLogin);

        Status status =
                statusRepository.createStatus(currentLogin,
                        statusPrivate,
                        group,
                        attachmentIds,
                        content,
                        discussionId,
                        replyTo,
                        replyToUsername);

        if (attachmentIds != null && attachmentIds.size() > 0) {
            for (String attachmentId : attachmentIds) {
                statusAttachmentRepository.addAttachmentId(status.getStatusId(),
                        attachmentId);
            }
        }

        // add status to the timeline
        addStatusToTimelineAndNotify(currentLogin, status);

        if (status.getStatusPrivate()) { // Private status
            // add status to the mentioned users' timeline
            manageMentions(status, null, currentLogin, domain, new ArrayList<String>());

        } else { // Public status
            Collection<String> followersForUser = followerRepository.findFollowersForUser(currentLogin);

            // add status to the dayline, userline
            String day = StatsService.DAYLINE_KEY_FORMAT.format(status.getStatusDate());
            daylineRepository.addStatusToDayline(status, day);
            userlineRepository.addStatusToUserline(status);

            // add the status to the group line and group followers
            manageGroups(status, group, followersForUser);

            // tag managgement
            manageStatusTags(status, group);

            // add status to the mentioned users' timeline
            manageMentions(status, group, currentLogin, domain, followersForUser);

            // Increment status count for the current user
            counterRepository.incrementStatusCounter(currentLogin);

            // Add to the searchStatus engine
            searchService.addStatus(status);

            // add status to the company wall
            addToCompanyWall(status, group);
        }

        if (log.isInfoEnabled()) {
            long finishTime = Calendar.getInstance().getTimeInMillis();
            log.info("Status created in " + (finishTime - startTime) + "ms.");
        }
        return status;
    }

    private void manageGroups(Status status, Group group, Collection<String> followersForUser) {
        if (group != null) {
            grouplineRepository.addStatusToGroupline(status, group.getGroupId());
            Collection<String> groupMemberLogins = groupMembersRepository.findMembers(group.getGroupId()).keySet();
            // For all people following the group
            for (String groupMemberLogin : groupMemberLogins) {
                addStatusToTimelineAndNotify(groupMemberLogin, status);
            }
            if (isPublicGroup(group)) { // for people not following the group but following the user
                for (String followerLogin : followersForUser) {
                    if (!groupMemberLogins.contains(followerLogin)) {
                        addStatusToTimelineAndNotify(followerLogin, status);
                    }
                }
            }
        } else { // only people following the user
            for (String followerLogin : followersForUser) {
                addStatusToTimelineAndNotify(followerLogin, status);
            }
        }
    }


    private void addToCompanyWall(Status status, Group group) {
        if (isPublicGroup(group)) {
            domainlineRepository.addStatusToDomainline(status, status.getDomain());
        }
    }

    /**
     * Parses the status to find tags, and add those tags to the TagLine and the Trends.
     * <p/>
     * The Tatami Bot is a specific use case : as it sends a lot of statuses, it may pollute the global trends,
     * so it is excluded from it.
     */
    private void manageStatusTags(Status status, Group group) {
        Matcher m = PATTERN_HASHTAG.matcher(status.getContent());
        while (m.find()) {
            String tag = m.group(2);
            if (tag != null && !tag.isEmpty() && !tag.contains("#")) {
                if (log.isDebugEnabled()) {
                    log.debug("Found tag : " + tag);
                }
                taglineRepository.addStatusToTagline(status, tag);
                tagCounterRepository.incrementTagCounter(status.getDomain(), tag);
                //Excludes the Tatami Bot from the global trend
                if (!status.getUsername().equals(Constants.TATAMIBOT_NAME)) {
                    trendsRepository.addTag(status.getDomain(), tag);
                }
                userTrendRepository.addTag(status.getLogin(), tag);

                // Add the status to all users following this tag
                addStatusToTagFollowers(status, group, tag);
            }
        }
    }

    private void manageMentions(Status status, Group group, String currentLogin, String domain, Collection<String> followersForUser) {
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
                if (!isPublicGroup(group)) {
                    Collection<String> groupIds = userGroupRepository.findGroups(mentionedLogin);
                    if (groupIds.contains(group.getGroupId())) { // The user is part of the private group
                        mentionUser(status, mentionedLogin);
                    }
                } else { // This is a public status
                    mentionUser(status, mentionedLogin);
                }
            }
        }
    }

    private void addStatusToTagFollowers(Status status, Group group, String tag) {
        Collection<String> followersForTag =
                tagFollowerRepository.findFollowers(status.getDomain(), tag);

        if (isPublicGroup(group)) { // This is a public status
            for (String followerLogin : followersForTag) {
                addStatusToTimelineAndNotify(followerLogin, status);
            }
        } else {  // This is a private status
            for (String followerLogin : followersForTag) {
                Collection<String> groupIds = userGroupRepository.findGroups(followerLogin);
                if (groupIds.contains(group.getGroupId())) { // The user is part of the private group
                    addStatusToTimelineAndNotify(followerLogin, status);
                }
            }
        }
    }

    /**
     * A status that mentions a user is put in the user's mentionline and in his timeline.
     * The mentioned user can also be notified by email.
     */
    private void mentionUser(Status status, String mentionedLogin) {
        mentionlineRepository.addStatusToMentionline(mentionedLogin, status);
        addStatusToTimelineAndNotify(mentionedLogin, status);
        User mentionnedUser = userRepository.findUserByLogin(mentionedLogin);

        if (mentionnedUser != null && (mentionnedUser.getPreferencesMentionEmail() == null || mentionnedUser.getPreferencesMentionEmail().equals(true))) {
            if (status.getStatusPrivate()) { // Private status
                mailService.sendUserPrivateMessageEmail(status, mentionnedUser);
            } else {
                mailService.sendUserMentionEmail(status, mentionnedUser);
            }
        }
    }

    private String extractUsernameWithoutAt(String dest) {
        return dest.substring(1, dest.length());
    }

    private boolean isPublicGroup(Group group) {
        return group == null || group.isPublicGroup();
    }

    /**
     * Adds the status to the timeline and notifies the user with Atmosphere.
     */
    private void addStatusToTimelineAndNotify(String login, Status status) {
        timelineRepository.addStatusToTimeline(login, status);
        notificationService.notifyUser(login, status);
    }
}
