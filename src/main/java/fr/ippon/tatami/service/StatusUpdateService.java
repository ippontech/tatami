package fr.ippon.tatami.service;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.status.*;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.security.UserDetailsService;
import fr.ippon.tatami.service.exception.ArchivedGroupException;
import fr.ippon.tatami.service.exception.ReplyStatusException;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.StatusDTO;
import org.apache.commons.lang.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.*;
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
    private DaylineRepository daylineRepository;

    @Inject
    private StatusRepository statusRepository;

    @Inject
    private TimelineRepository timelineRepository;

    @Inject
    private MentionService mentionService;

    @Inject
    private UserRepository userRepository;

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
    private UserDetailsService userDetailsService;

    @Inject
    private UserService userService;

    @Inject
    private MailService mailService;

    @Inject
    private TimelineService timelineService;

    @Inject
    private ReportedStatusRepository reportedStatusRepository;

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
            group = groupService.getGroupById(status.getDomain(), UUID.fromString(status.getGroupId()));

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
                    realOriginalStatus.getStatusId().toString(),
                    status.getStatusId().toString(),
                    status.getUsername(),
                    attachmentIds);

            discussionRepository.addReplyToDiscussion(realOriginalStatus.getStatusId().toString(), replyStatus.getStatusId().toString());
        } else {
            log.debug("Replying directly to the status at the origin of the disucssion");
            // The original status of the discussion is the one we reply to
            Status replyStatus =
                    createStatus(content,
                            status.getStatusPrivate(),
                            group,
                            status.getStatusId().toString(),
                            status.getStatusId().toString(),
                            status.getUsername(),
                            attachmentIds);

            discussionRepository.addReplyToDiscussion(status.getStatusId().toString(), replyStatus.getStatusId().toString());
        }
    }

    public void reportedStatus(User reportingUser, String statusId) {
        log.debug("Reported Status: '{}'", statusId);
        String domain = DomainUtil.getDomainFromEmail(SecurityUtils.getCurrentUserEmail());
        reportedStatusRepository.reportStatus(domain, statusId, reportingUser.getEmail());
        mailService.sendReportedStatusEmail(reportingUser, statusId);
    }

    private List<String> getAllReportedStatuses(String domain) {
        return reportedStatusRepository.findReportedStatuses(domain);
    }

    public Collection<StatusDTO> findReportedStatuses() {
        String domain = DomainUtil.getDomainFromEmail(SecurityUtils.getCurrentUserEmail());
        List<String> reportedStatusId = getAllReportedStatuses(domain);
        return timelineService.buildStatusList(reportedStatusId);
    }

    public void deleteReportedStatus(String statusId) {
        String currentEmail = SecurityUtils.getCurrentUserEmail();
        if (userService.isAdmin(currentEmail)) {
            log.debug("ADMIN deleting reported status '{}'", statusId);
            reportedStatusRepository.unreportStatus(DomainUtil.getDomainFromEmail(currentEmail), statusId);
            timelineService.removeStatus(statusId);
        } else {
            log.warn("Attempted to delete reported status '{}' but is not an admin", statusId);
        }
    }

    public void approveReportedStatus(String statusId) {
        String currentEmail = SecurityUtils.getCurrentUserEmail();
        if (userService.isAdmin(currentEmail)) {
            log.debug("Admin approves reported status '{}'", statusId);
            reportedStatusRepository.unreportStatus(DomainUtil.getDomainFromEmail(currentEmail), statusId);
        } else {
            log.warn("Attempted to approve status '{}' but is not an admin", statusId);
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
        String currentEmail;
        if (user == null) {
            currentEmail = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get().getEmail();
        } else {
            currentEmail = user.getEmail();
        }
        String username = userRepository.findOneByEmail(currentEmail).get().getUsername();
        String domain = DomainUtil.getDomainFromEmail(currentEmail);

        Status status =
                statusRepository.createStatus(username,
                        currentEmail,
                        domain,
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
                statusAttachmentRepository.addAttachmentId(status.getStatusId().toString(),
                        attachmentId);
            }
        }

        // add status to the timeline
        addStatusToTimelineAndNotify(currentEmail, status);

        if (status.getStatusPrivate()) { // Private status
            // add status to the mentioned users' timeline
            manageMentions(status, null, currentEmail, new ArrayList<String>(), domain);

        } else { // Public status
            Collection<String> followersForUser = followerRepository.findFollowersForUser(currentEmail);

            // add status to the dayline, userline
            String day = StatsService.DAYLINE_KEY_FORMAT.format(status.getStatusDate());
            daylineRepository.addStatusToDayline(status, day);
            userlineRepository.addStatusToUserline(status.getEmail(), status.getStatusId().toString());

            // add the status to the group line and group followers
            manageGroups(status, group, followersForUser);

            // tag managgement
            manageStatusTags(status, group);

            // add status to the mentioned users' timeline
            manageMentions(status, group, currentEmail, followersForUser, domain);

            // Increment status count for the current user
            counterRepository.incrementStatusCounter(currentEmail);

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
            grouplineRepository.addStatusToGroupline(group.getGroupId(), status.getStatusId().toString());
            Collection<String> groupMemberUsernames = groupMembersRepository.findMembers(group.getGroupId()).keySet();
            // For all people following the group
            for (String groupMemberUsername : groupMemberUsernames) {
                addStatusToTimelineAndNotify(groupMemberUsername, status);
            }
            if (isPublicGroup(group)) { // for people not following the group but following the user
                for (String followerUsername : followersForUser) {
                    if (!groupMemberUsernames.contains(followerUsername)) {
                        addStatusToTimelineAndNotify(followerUsername, status);
                    }
                }
            }
        } else { // only people following the user
            for (String followerUsername : followersForUser) {
                addStatusToTimelineAndNotify(followerUsername, status);
            }
        }
    }

    private void addToCompanyWall(Status status, Group group) {
        if (isPublicGroup(group)) {
            domainlineRepository.addStatusToDomainline(status.getDomain(), status.getStatusId().toString());
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
                userTrendRepository.addTag(status.getUsername(), tag);

                // Add the status to all users following this tag
                addStatusToTagFollowers(status, group, tag);
            }
        }
    }

    private void manageMentions(Status status, Group group, String currentUser, Collection<String> followersForUser, String domain) {
        Matcher m = PATTERN_LOGIN.matcher(status.getContent());
        while (m.find()) {
            String mentionedUser = extractUsernameWithoutAt(m.group());
            String mentionedUserEmail = (mentionedUser + "@" + domain);
            if (mentionedUser != null &&
                    !mentionedUser.equals(currentUser) &&
                    !followersForUser.contains(mentionedUser)) {

                log.debug("Mentioning : {}", mentionedUserEmail);

                // If this is a private group, and if the mentioned user is not in the group, he will not see the status
                if (!isPublicGroup(group)) {
                    Collection<UUID> groupIds = userGroupRepository.findGroups(mentionedUserEmail);
                    if (groupIds.contains(group.getGroupId())) { // The user is part of the private group
                        mentionUser(mentionedUserEmail, status);
                    }
                } else { // This is a public status
                    mentionUser(mentionedUserEmail, status);
                }
            }
        }
    }

    private void addStatusToTagFollowers(Status status, Group group, String tag) {
        Collection<String> followersEmailForTag =
                tagFollowerRepository.findFollowers(status.getDomain(), tag);

        if (isPublicGroup(group)) { // This is a public status
            for (String followerEmail : followersEmailForTag) {
                addStatusToTimelineAndNotify(followerEmail, status);
            }
        } else {  // This is a private status
            for (String followerEmail : followersEmailForTag) {
                Collection<UUID> groupIds = userGroupRepository.findGroups(followerEmail);
                if (groupIds.contains(group.getGroupId())) { // The user is part of the private group
                    addStatusToTimelineAndNotify(followerEmail, status);
                }
            }
        }
    }

    /**
     * A status that mentions a user is put in the user's mentionline and in his timeline.
     * The mentioned user can also be notified by email or iOS push.
     */
    private void mentionUser(String mentionedEmail, Status status) {
        addStatusToTimelineAndNotify(mentionedEmail, status);
        mentionService.mentionUser(mentionedEmail, status);
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
    private void addStatusToTimelineAndNotify(String email, Status status) {
        timelineRepository.addStatusToTimeline(email, status.getStatusId().toString());
        atmosphereService.notifyUser(email, status);
    }

}
