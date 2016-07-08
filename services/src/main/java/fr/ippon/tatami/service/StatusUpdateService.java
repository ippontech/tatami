package fr.ippon.tatami.service;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.status.*;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.exception.ArchivedGroupException;
import fr.ippon.tatami.service.exception.ReplyStatusException;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.lang.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class StatusUpdateService {

    private static final Logger log = LoggerFactory.getLogger(StatusUpdateService.class);

    private static final Pattern PATTERN_LOGIN = Pattern.compile("@[^\\s,\\p{Punct}]+");

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
    private MentionService mentionService;

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
    private DomainlineRepository domainlineRepository;

    @Inject
    private StatusAttachmentRepository statusAttachmentRepository;

    @Inject
    private AtmosphereService atmosphereService;

    @Inject
    private MailService mailService;

    @Inject
    private UserRepository userRepository;

    public void postStatus(String content, boolean statusPrivate, Collection<String> attachmentIds, String geoLocalization) {
        createStatus(content, statusPrivate, null, "", "", "", attachmentIds, null, geoLocalization);
    }

    public void postStatus(String content, boolean statusPrivate, Collection<String> attachmentIds) {
        createStatus(content, statusPrivate, null, "", "", "", attachmentIds);
    }

    public void postStatusToGroup(String content, Group group, Collection<String> attachmentIds, String geoLocalization) {
        createStatus(content, false, group, "", "", "", attachmentIds, null, geoLocalization);
    }

    public void postStatusAsUser(String content, User user) {
        createStatus(content, false, null, "", "", "", null, user, null);
    }

    public void replyToStatus(String content, String replyTo, Collection<String> attachmentIds) throws ArchivedGroupException, ReplyStatusException {
        AbstractStatus abstractStatus = statusRepository.findStatusById(replyTo);
        if (abstractStatus != null &&
                !abstractStatus.getType().equals(StatusType.STATUS) &&
                !abstractStatus.getType().equals(StatusType.SHARE) &&
                !abstractStatus.getType().equals(StatusType.ANNOUNCEMENT)) {

            log.debug("Cannot reply to a status of this type");
            throw new ReplyStatusException();
        }
        if (abstractStatus != null &&
                abstractStatus.getType().equals(StatusType.SHARE)) {

            log.debug("Replacing the share by the original status");
            Share share = (Share) abstractStatus;
            AbstractStatus abstractRealStatus = statusRepository.findStatusById(share.getOriginalStatusId());
            abstractStatus = abstractRealStatus;
        } else if (abstractStatus != null &&
                abstractStatus.getType().equals(StatusType.ANNOUNCEMENT)) {

            log.debug("Replacing the announcement by the original status");
            Announcement announcement = (Announcement) abstractStatus;
            AbstractStatus abstractRealStatus = statusRepository.findStatusById(announcement.getOriginalStatusId());
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
                    status.getUsername(),
                    attachmentIds);

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
                            status.getUsername(),
                            attachmentIds);

            discussionRepository.addReplyToDiscussion(status.getStatusId(), replyStatus.getStatusId());
        }
    }

    private Status createStatus(String content,
                                boolean statusPrivate,
                                Group group,
                                String discussionId,
                                String replyTo,
                                String replyToUsername,
                                Collection<String> attachmentIds) {

        return createStatus(
                content,
                statusPrivate,
                group,
                discussionId,
                replyTo,
                replyToUsername,
                attachmentIds,
                null, null);
    }

    private Status createStatus(String content,
                                boolean statusPrivate,
                                Group group,
                                String discussionId,
                                String replyTo,
                                String replyToUsername,
                                Collection<String> attachmentIds,
                                User user,
                                String geoLocalization) {

        content = StringEscapeUtils.unescapeHtml(content);
        long startTime = 0;
        if (log.isInfoEnabled()) {
            startTime = Calendar.getInstance().getTimeInMillis();
            log.debug("Creating new status : {}", content);
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
                        replyToUsername,
                        geoLocalization);

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
            userlineRepository.addStatusToUserline(status.getLogin(), status.getStatusId());

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
            grouplineRepository.addStatusToGroupline(group.getGroupId(), status.getStatusId());
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
            domainlineRepository.addStatusToDomainline(status.getDomain(), status.getStatusId());
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
                log.debug("Found tag : {}", tag);
                taglineRepository.addStatusToTagline(tag, status);
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

                log.debug("Mentionning : {}", mentionedUsername);
                String mentionedLogin =
                        DomainUtil.getLoginFromUsernameAndDomain(mentionedUsername, domain);

                // If this is a private group, and if the mentioned user is not in the group, he will not see the status
                if (!isPublicGroup(group)) {
                    Collection<String> groupIds = userGroupRepository.findGroups(mentionedLogin);
                    if (groupIds.contains(group.getGroupId())) { // The user is part of the private group
                        mentionUser(mentionedLogin, status);
                    }
                } else { // This is a public status
                    mentionUser(mentionedLogin, status);
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
     * The mentioned user can also be notified by email or iOS push.
     */
    private void mentionUser(String mentionedLogin, Status status) {
        addStatusToTimelineAndNotify(mentionedLogin, status);
        mentionService.mentionUser(mentionedLogin, status);
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
        timelineRepository.addStatusToTimeline(login, status.getStatusId());
        atmosphereService.notifyUser(login, status);
    }

    public void reportedStatus(String mentionedLogin, String statusId) {

        //need to take into consideration private group posts, etc... for admins
        //if a user flags a post in a private group, admin needs to be able to review post
        //same for private messages
//        if (mentionnedUser != null && (mentionnedUser.getPreferencesMentionEmail() == null || mentionnedUser.getPreferencesMentionEmail().equals(true))) {
//            if (status.getStatusPrivate()) { // Private status
//                mailService.sendUserPrivateMessageEmail(mentionnedUser, status);
//                if (applePushService != null) {
//                    applePushService.notifyUser(mentionedLogin, status);
//                }
//            } else {

        mailService.sendReportedStatusEmail(mentionedLogin, statusRepository.findStatusById(statusId));

//            }
//        }
    }
}
