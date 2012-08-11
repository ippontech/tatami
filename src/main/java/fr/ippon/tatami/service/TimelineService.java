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
    private StatusDetailsRepository statusDetailsRepository;

    @Inject
    private CounterRepository counterRepository;

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
        Collection<String> statusIds = new ArrayList<String>();
        statusIds.add(statusId);
        Collection<Status> statusCollection = this.buildStatusList(statusIds);
        if (statusCollection.isEmpty()) {
            return null;
        } else {
            return statusCollection.iterator().next();
        }
    }

    public StatusDetails getStatusDetails(String statusId) {
        return statusDetailsRepository.findStatusDetails(statusId);
    }

    public Collection<Status> buildStatusList(Collection<String> statusIds) {
        User currentUser = authenticationService.getCurrentUser();
        Collection<String> favoriteIds = statusRepository.getFavoritesline(currentUser.getLogin());
        Collection<Status> statuses = new ArrayList<Status>(statusIds.size());
        for (String statusId : statusIds) {
            Status status = this.statusRepository.findStatusById(statusId);
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
                    if (favoriteIds.contains(statusId)) {
                        statusCopy.setFavorite(true);
                    } else {
                        statusCopy.setFavorite(false);
                    }
                    statusCopy.setFirstName(statusUser.getFirstName());
                    statusCopy.setLastName(statusUser.getLastName());
                    statusCopy.setGravatar(statusUser.getGravatar());
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
        Collection<String> statusIds = this.taglineRepository.getTagline(domain, tag, nbStatus);

        return this.buildStatusList(statusIds);
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
        Collection<String> statusIds = statusRepository.getTimeline(login, nbStatus, since_id, max_id);
        return buildStatusList(statusIds);
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
        Collection<String> statusIds = statusRepository.getUserline(login, nbStatus, since_id, max_id);
        return this.buildStatusList(statusIds);
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
        statusRepository.shareStatusToUserline(currentLogin, status);
        // add status to the follower's timelines
        Collection<String> followersForUser = followerRepository.findFollowersForUser(currentLogin);
        for (String followerLogin : followersForUser) {
            statusRepository.shareStatusToTimeline(currentLogin, followerLogin, status);
        }
    }

    public void addFavoriteStatus(String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("Favorite status : " + statusId);
        }
        Status status = statusRepository.findStatusById(statusId);
        String login = authenticationService.getCurrentUser().getLogin();
        statusRepository.addStatusToFavoritesline(status, login);
    }

    public void removeFavoriteStatus(String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("Un-favorite status : " + statusId);
        }
        Status status = statusRepository.findStatusById(statusId);
        User currentUser = authenticationService.getCurrentUser();
        statusRepository.removeStatusFromFavoritesline(status, currentUser.getLogin());
    }

    /**
     * The favline contains the user's favorites status
     *
     * @return a status list
     */
    public Collection<Status> getFavoritesline() {
        String currentLogin = this.authenticationService.getCurrentUser().getLogin();
        Collection<String> statusIds = this.statusRepository.getFavoritesline(currentLogin);
        return this.buildStatusList(statusIds);
    }
}
