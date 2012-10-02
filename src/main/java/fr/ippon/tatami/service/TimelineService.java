package fr.ippon.tatami.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.StatusDetails;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.repository.DiscussionRepository;
import fr.ippon.tatami.repository.FavoritelineRepository;
import fr.ippon.tatami.repository.FollowerRepository;
import fr.ippon.tatami.repository.GrouplineRepository;
import fr.ippon.tatami.repository.MentionlineRepository;
import fr.ippon.tatami.repository.SharesRepository;
import fr.ippon.tatami.repository.StatusRepository;
import fr.ippon.tatami.repository.TaglineRepository;
import fr.ippon.tatami.repository.TimelineRepository;
import fr.ippon.tatami.repository.UserlineRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.security.DomainViolationException;
import fr.ippon.tatami.service.util.DomainUtil;

/**
 * Manages the timeline.
 *
 * @author Julien Dubois
 */
@Service
public class TimelineService {

    private final Log log = LogFactory.getLog(TimelineService.class);

    private final static String hashtagDefault = "---";

    @Inject
    private UserService userService;

    @Inject
    private StatusRepository statusRepository;

    @Inject
    private SharesRepository sharesRepository;

    @Inject
    private DiscussionRepository discussionRepository;

    @Inject
    private CounterRepository counterRepository;

    @Inject
    private TimelineRepository timelineRepository;

    @Inject
    private MentionlineRepository mentionlineRepository;

    @Inject
    private UserlineRepository userlineRepository;

    @Inject
    private FavoritelineRepository favoritelineRepository;

    @Inject
    private TaglineRepository taglineRepository;

    @Inject
    private GrouplineRepository grouplineRepository;

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private SearchService searchService;

    public Status getStatus(String statusId) {
        Map<String, SharedStatusInfo> line = new HashMap<String, SharedStatusInfo>();
        line.put(statusId, null);
        Collection<Status> statusCollection = buildStatusList(line);
        if (statusCollection.isEmpty()) {
            return null;
        } else {
            return statusCollection.iterator().next();
        }
    }

    /**
     * Get the details for a status
     * - Who shared this status
     * - The discussion in which this status belongs to
     */
    public StatusDetails getStatusDetails(String statusId) {
        StatusDetails details = new StatusDetails();
        details.setStatusId(statusId);

        // Shares management
        Collection<String> sharedByLogins = sharesRepository.findLoginsWhoSharedAStatus(statusId);
        details.setSharedByLogins(sharedByLogins);

        // Discussion management
        Status status = statusRepository.findStatusById(statusId);
        Collection<String> statusIdsInDiscussion = new LinkedHashSet<String>();
        String replyTo = status.getReplyTo();
        if (replyTo != null && !replyTo.equals("")) { // If this is a reply, get the original discussion
            // Add the original discussion
            statusIdsInDiscussion.add(status.getReplyTo());
            // Add the replies
            statusIdsInDiscussion.addAll(discussionRepository.findStatusIdsInDiscussion(status.getReplyTo()));
            // Remove the current status from the list
            statusIdsInDiscussion.remove(statusId);
        } else { // This is the original discussion
            // Add the replies
            statusIdsInDiscussion.addAll(discussionRepository.findStatusIdsInDiscussion(statusId));
        }

        // Transform the Set to a Map<String, String>
        Map<String, SharedStatusInfo> line = new LinkedHashMap<String, SharedStatusInfo>();
        for (String statusIdInDiscussion : statusIdsInDiscussion) {
            line.put(statusIdInDiscussion, null);
        }
        // Enrich the details object with the complete statuses in the discussion
        Collection<Status> statusesInDiscussion = buildStatusList(line);
        details.setDiscussionStatuses(statusesInDiscussion);
        return details;
    }

    public Collection<Status> buildStatusList(Map<String, SharedStatusInfo> line) {
        User currentUser = authenticationService.getCurrentUser();
        Map<String, SharedStatusInfo> favoriteLine = favoritelineRepository.getFavoriteline(currentUser.getLogin());
        Collection<Status> statuses = new ArrayList<Status>(line.size());
        for (String statusId : line.keySet()) {
            SharedStatusInfo sharedStatusInfo = line.get(statusId);
            Status status = null;
            if (sharedStatusInfo != null) {
                status = statusRepository.findStatusById(sharedStatusInfo.getOriginalStatusId());
            } else {
                status = statusRepository.findStatusById(statusId);
            }
            if (status != null) {
                User statusUser = userService.getUserByLogin(status.getLogin());
                if (statusUser != null) {
                    // Security check
                    if (!statusUser.getDomain().equals(currentUser.getDomain())) {
                        throw new DomainViolationException("User " + currentUser + " tried to access " +
                                " status : " + status);

                    }

                    // if the Status comes from ehcache, it has to be cloned.
                    // ehcache shares the Status instances per statusId, but favorites are per user and
                    // shared statuses are also per user
                    Status statusCopy = new Status();
                    statusCopy.setLogin(status.getLogin());
                    statusCopy.setStatusId(status.getStatusId());
                    statusCopy.setGroupId(status.getGroupId());
                    if (sharedStatusInfo != null) { // Manage shared statuses
                        statusCopy.setTimelineId(sharedStatusInfo.getSharedStatusId());
                        String sharedByLogin = sharedStatusInfo.getSharedByLogin();
                        String sharedByUsername = DomainUtil.getUsernameFromLogin(sharedByLogin);
                        statusCopy.setSharedByUsername(sharedByUsername);
                    } else {
                        statusCopy.setTimelineId(status.getStatusId());
                    }
                    statusCopy.setContent(status.getContent());
                    statusCopy.setUsername(status.getUsername());
                    statusCopy.setDomain(status.getDomain());
                    statusCopy.setStatusDate(status.getStatusDate());
                    statusCopy.setReplyTo(status.getReplyTo());
                    statusCopy.setReplyToUsername(status.getReplyToUsername());
                    if (favoriteLine.containsKey(statusId)) {
                        statusCopy.setFavorite(true);
                    } else {
                        statusCopy.setFavorite(false);
                    }
                    statusCopy.setFirstName(statusUser.getFirstName());
                    statusCopy.setLastName(statusUser.getLastName());
                    statusCopy.setGravatar(statusUser.getGravatar());
                    statusCopy.setDetailsAvailable(status.isDetailsAvailable());
                    statuses.add(statusCopy);
                } else {
                    if (log.isDebugEnabled()) {
                        log.debug("Deleted user : " + status.getLogin());
                    }
                }
            } else {
                if (log.isDebugEnabled()) {
                    log.debug("Invisible status : " + statusId);
                }
            }
        }
        return statuses;
    }

	/**
     * The mentionline contains a statuses where the current user is mentioned.
     *
     * @return a status list
     */
    public Collection<Status> getMentionline(int nbStatus, String since_id, String max_id) {
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Map<String, SharedStatusInfo> line =
                mentionlineRepository.getMentionline(currentUser.getLogin(), nbStatus, since_id, max_id);

        return buildStatusList(line);
    }

    /**
     * The tagline contains a tag's statuses
     *
     * @param tag      the tag to retrieve the timeline of
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<Status> getTagline(String tag, int nbStatus, String since_id, String max_id) {
        if (tag == null || tag.isEmpty()) {
            tag = hashtagDefault;
        }
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Map<String, SharedStatusInfo> line = taglineRepository.getTagline(domain, tag, nbStatus, since_id, max_id);
        return buildStatusList(line);
    }

    /**
     * The groupline contains a group's statuses
     *
     * @param group      the group to retrieve the timeline of
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<Status> getGroupline(String groupId, Integer count, String since_id, String max_id) {
        Map<String, SharedStatusInfo> line = grouplineRepository.getGroupline(groupId, count, since_id, max_id);
        return buildStatusList(line);
    }

    /**
     * The timeline contains the user's status merged with his friends status
     *
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<Status> getTimeline(int nbStatus, String since_id, String max_id) {
        String login = authenticationService.getCurrentUser().getLogin();
        Map<String, SharedStatusInfo> line =
                timelineRepository.getTimeline(login, nbStatus, since_id, max_id);

        return buildStatusList(line);
    }

    /**
     * The userline contains the user's own status
     *
     * @param username the user to retrieve the userline of
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<Status> getUserline(String username, int nbStatus, String since_id, String max_id) {
        String login = null;
        User currentUser = authenticationService.getCurrentUser();
        if (username == null || username.isEmpty()) { // current user
            login = currentUser.getLogin();
        } else {  // another user, in the same domain
            String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
            login = DomainUtil.getLoginFromUsernameAndDomain(username, domain);
        }
        Map<String, SharedStatusInfo> line = userlineRepository.getUserline(login, nbStatus, since_id, max_id);
        return this.buildStatusList(line);
    }

    public void removeStatus(String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("Removing status : " + statusId);
        }
        final Status status = statusRepository.findStatusById(statusId);

        final User currentUser = authenticationService.getCurrentUser();
        if (status.getLogin().equals(currentUser.getLogin())
                && Boolean.FALSE.equals(status.getRemoved())) {
            statusRepository.removeStatus(status);
            counterRepository.decrementStatusCounter(currentUser.getLogin());
            searchService.removeStatus(status);
        }
    }

    public void shareStatus(String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("Share status : " + statusId);
        }
        String currentLogin = this.authenticationService.getCurrentUser().getLogin();
        Status status = statusRepository.findStatusById(statusId);
        // add status to the user's userline and timeline
        userlineRepository.shareStatusToUserline(currentLogin, status);
        timelineRepository.shareStatusToTimeline(currentLogin, currentLogin, status);
        // add status to the follower's timelines
        Collection<String> followersForUser = followerRepository.findFollowersForUser(currentLogin);
        for (String followerLogin : followersForUser) {
            timelineRepository.shareStatusToTimeline(currentLogin, followerLogin, status);
        }
        // update the status details to add this share
        sharesRepository.newShareByLogin(statusId, currentLogin);
    }

    public void addFavoriteStatus(String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("Favorite status : " + statusId);
        }
        Status status = statusRepository.findStatusById(statusId);
        String login = authenticationService.getCurrentUser().getLogin();
        favoritelineRepository.addStatusToFavoriteline(status, login);
    }

    public void removeFavoriteStatus(String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("Un-favorite status : " + statusId);
        }
        Status status = statusRepository.findStatusById(statusId);
        User currentUser = authenticationService.getCurrentUser();
        favoritelineRepository.removeStatusFromFavoriteline(status, currentUser.getLogin());
    }

    /**
     * The favline contains the user's favorites status
     *
     * @return a status list
     */
    public Collection<Status> getFavoritesline() {
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        Map<String, SharedStatusInfo> line = favoritelineRepository.getFavoriteline(currentLogin);
        return this.buildStatusList(line);
    }
}
