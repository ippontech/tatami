package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.StatusDetails;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.security.DomainViolationException;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

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
    private FavoritelineRepository favoritelineRepository;

    @Inject
    private TaglineRepository taglineRepository;

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private IndexService indexService;

    @Inject
    @Named("indexActivated")
    private boolean indexActivated;

    public Status getStatus(String statusId) {
        Map<String, String> line = new HashMap<String, String>();
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
        Collection<String> statusIdsInDiscussion;
        String replyTo = status.getReplyTo();
        if (replyTo != null && !replyTo.equals("")) { // If this is a reply, get the original discussion
            statusIdsInDiscussion = discussionRepository.findStatusIdsInDiscussion(status.getReplyTo());
        } else { // This is the original discussion
            statusIdsInDiscussion = discussionRepository.findStatusIdsInDiscussion(statusId);
        }
        // Enrich the details object with the complete statuses in the discussion
        Collection<Status> statusesInDiscussion = new ArrayList<Status>();
        for (String statusIdInDiscussion : statusIdsInDiscussion) {
            Status statusInDiscussion = statusRepository.findStatusById(statusIdInDiscussion);
            statusesInDiscussion.add(statusInDiscussion);
        }
        details.setDiscussionStatuses(statusesInDiscussion);
        return details;
    }

    public Collection<Status> buildStatusList(Map<String, String> line) {
        User currentUser = authenticationService.getCurrentUser();
        Map<String, String> favoriteLine = favoritelineRepository.getFavoriteline(currentUser.getLogin());
        Collection<Status> statuses = new ArrayList<Status>(line.size());
        for (String statusId : line.keySet()) {
            Status status = statusRepository.findStatusById(statusId);
            if (status != null) {
                User statusUser = userService.getUserByLogin(status.getLogin());
                if (statusUser != null) {
                    // Security check
                    if (!statusUser.getDomain().equals(currentUser.getDomain())) {
                        throw new DomainViolationException("User " + currentUser + " tried to access " +
                                " status : " + status);

                    }
                    // if the Status comes from ehcache, it has to be cloned to another instance
                    // in order to be thread-safe.
                    // ehcache shares the Status instances per statusId, but favorites are per user.
                    Status statusCopy = new Status();
                    statusCopy.setLogin(status.getLogin());
                    statusCopy.setStatusId(status.getStatusId());
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
                    String sharedByLogin = line.get(statusId);
                    if (sharedByLogin != null && !sharedByLogin.equals("")) {
                        String sharedByUsername = DomainUtil.getUsernameFromLogin(sharedByLogin);
                        statusCopy.setSharedByUsername(sharedByUsername);
                    }
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
     * The tagline contains a tag's status
     *
     * @param tag      the tag to retrieve the timeline of
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<Status> getTagline(String tag, int nbStatus) {
        if (tag == null || tag.isEmpty()) {
            tag = hashtagDefault;
        }
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Map<String, String> line = taglineRepository.getTagline(domain, tag, nbStatus);
        return buildStatusList(line);
    }

    /**
     * The timeline contains the user's status merged with his friends status
     *
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @param since_id
     * @param max_id   @return a status list
     */
    public Collection<Status> getTimeline(int nbStatus, String since_id, String max_id) {
        String login = authenticationService.getCurrentUser().getLogin();
        Map<String, String> line = statusRepository.getTimeline(login, nbStatus, since_id, max_id);
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
        Map<String, String> line = statusRepository.getUserline(login, nbStatus, since_id, max_id);
        return this.buildStatusList(line);
    }

    public void removeStatus(String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("Removing status : " + statusId);
        }
        final Status status = statusRepository.findStatusById(statusId);

        final User currentUser = authenticationService.getCurrentUser();
        if (status.getLogin().equals(currentUser.getLogin())
                && !Boolean.TRUE.equals(status.getRemoved())) {
            statusRepository.removeStatus(status);
            counterRepository.decrementStatusCounter(currentUser.getLogin());
            if (indexActivated) {
                indexService.removeStatus(status);
            }
        }
    }

    public void shareStatus(String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("Share status : " + statusId);
        }
        String currentLogin = this.authenticationService.getCurrentUser().getLogin();
        Status status = statusRepository.findStatusById(statusId);
        // add status to the user's userline and timeline
        statusRepository.shareStatusToUserline(currentLogin, status);
        statusRepository.shareStatusToTimeline(currentLogin, currentLogin, status);
        // add status to the follower's timelines
        Collection<String> followersForUser = followerRepository.findFollowersForUser(currentLogin);
        for (String followerLogin : followersForUser) {
            statusRepository.shareStatusToTimeline(currentLogin, followerLogin, status);
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
        Map<String, String> line = favoritelineRepository.getFavoriteline(currentLogin);
        return this.buildStatusList(line);
    }
}
