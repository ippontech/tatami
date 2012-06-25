package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.UserStatusStat;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.security.DomainViolationException;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.inject.Named;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Manages the timeline.
 *
 * @author Julien Dubois
 */
@Service
public class TimelineService {

    @Inject
    private UserService userService;

    @Inject
    private StatusRepository statusRepository;

    @Inject
    private CounterRepository counterRepository;

    @Inject
    private DaylineRepository daylineRepository;

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

    private static final SimpleDateFormat DAYLINE_KEY_FORMAT = new SimpleDateFormat("ddMMyyyy");

    private String hashtagDefault = "---";

    private final Log log = LogFactory.getLog(TimelineService.class);

    private final static Pattern PATTERN_LOGIN = Pattern.compile("@[^\\s]+");

    public void postStatus(String content) {
        if (log.isDebugEnabled()) {
            log.debug("Creating new status : " + content);
        }
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        String username = DomainUtil.getUsernameFromLogin(currentLogin);
        String domain = DomainUtil.getDomainFromLogin(currentLogin);
        Status status = statusRepository.createStatus(currentLogin, username, domain, content);

        // add status to the dayline, userline, timeline, tagline
        String day = DAYLINE_KEY_FORMAT.format(status.getStatusDate());
        daylineRepository.addStatusToDayline(status, domain, day);
        statusRepository.addStatusToUserline(status);
        statusRepository.addStatusToTimeline(currentLogin, status);
        taglineRepository.addStatusToTagline(status, domain);

        // add status to the follower's timelines
        Collection<String> followersForUser = followerRepository.findFollowersForUser(currentLogin);
        for (String followerLogin : followersForUser) {
            statusRepository.addStatusToTimeline(followerLogin, status);
        }

        // add status to the mentioned users' timeline
        Matcher m = PATTERN_LOGIN.matcher(status.getContent());
        while (m.find()) {
            String mentionedLogin = extractLoginWithoutAt(m.group());
            if (mentionedLogin != null &&
                    !mentionedLogin.equals(currentLogin) &&
                    !followersForUser.contains(mentionedLogin)) {

                statusRepository.addStatusToTimeline(mentionedLogin, status);
            }
        }

        // Increment status count for the current user
        counterRepository.incrementStatusCounter(currentLogin);

        // Add to Elastic Search index if it is activated
        if (indexActivated) {
            indexService.addStatus(status);
        }
    }

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

    public Collection<Status> buildStatusList(Collection<String> statusIds) {
        User currentUser = authenticationService.getCurrentUser();
        Collection<String> favoriteIds = statusRepository.getFavoritesline(currentUser.getLogin());
        Collection<Status> statuses = new ArrayList<Status>(statusIds.size());
        for (String statusId : statusIds) {
            Status status = this.statusRepository.findStatusById(statusId);
            if (status != null) {
                User statusUser = userService.getUserByLogin(status.getLogin());
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
                    log.debug("Invisible status : " + statusId);
                }
            }
        }
        return statuses;
    }

    /**
     * The dayline contains a day's status.
     *
     * @return a status list
     */
    public Collection<UserStatusStat> getDayline() {
        Date today = new Date();
        return this.getDayline(today);
    }

    /**
     * The dayline contains a day's status.
     *
     * @param date the day to retrieve the status of
     * @return a status list
     */
    public Collection<UserStatusStat> getDayline(Date date) {
        if (date == null) {
            date = new Date();
        }
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        String day = DAYLINE_KEY_FORMAT.format(date);
        Collection<UserStatusStat> stats = daylineRepository.getDayline(domain, day);
        return stats;
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
            tag = this.hashtagDefault;
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
        return this.buildStatusList(statusIds);
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
        User currentUser = this.authenticationService.getCurrentUser();
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
        if (this.log.isDebugEnabled()) {
            this.log.debug("Removing status : " + statusId);
        }
        final Status status = this.statusRepository.findStatusById(statusId);

        final User currentUser = this.authenticationService.getCurrentUser();
        if (status.getLogin().equals(currentUser.getLogin())
                && !Boolean.TRUE.equals(status.getRemoved())) {
            this.statusRepository.removeStatus(status);
            this.counterRepository.decrementStatusCounter(currentUser.getLogin());
            if (this.indexActivated) {
                this.indexService.removeStatus(status);
            }
        }
    }

    public void addFavoriteStatus(String statusId) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("Marking status : " + statusId);
        }
        Status status = this.statusRepository.findStatusById(statusId);

        // registering
        User currentUser = this.authenticationService.getCurrentUser();
        this.statusRepository.addStatusToFavoritesline(status, currentUser.getLogin());

        // alerting
        if (!currentUser.getLogin().equals(status.getLogin())) {
            String content = '@' + currentUser.getUsername() + " liked your status<br/><em>_PH_...</em>";
            int maxLength = 140 - content.length() + 4;
            if (status.getContent().length() > maxLength) {
                content = content.replace("_PH_", status.getContent().substring(0, maxLength));
            } else {
                content = content.replace("_PH_", status.getContent());
            }

            String statusUsername = DomainUtil.getUsernameFromLogin(status.getLogin());
            String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
            Status helloStatus = this.statusRepository.createStatus(status.getLogin(), statusUsername, domain, content);
            this.statusRepository.addStatusToTimeline(status.getLogin(), helloStatus);
        }
    }

    public void removeFavoriteStatus(String statusId) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("Unmarking status : " + statusId);
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
        String login = this.authenticationService.getCurrentUser().getLogin();
        Collection<String> statusIds = this.statusRepository.getFavoritesline(login);
        return this.buildStatusList(statusIds);
    }

    private String extractLoginWithoutAt(String dest) {
        return dest.substring(1, dest.length());
    }

}
