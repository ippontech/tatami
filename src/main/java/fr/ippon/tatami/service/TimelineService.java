package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.repository.FollowerRepository;
import fr.ippon.tatami.repository.StatusRepository;
import fr.ippon.tatami.security.AuthenticationService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
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
    private FollowerRepository followerRepository;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private IndexService indexService;

    @Inject
    private boolean indexActivated;

    private String hashtagDefault = "---";

    private static final SimpleDateFormat DAYLINE_KEY_FORMAT = new SimpleDateFormat("ddMMyyyy");

    private final Log log = LogFactory.getLog(TimelineService.class);

    private final static Pattern PATTERN_LOGIN = Pattern.compile("@[^\\s]+");

    public void postStatus(String content) {
        if (log.isDebugEnabled()) {
            log.debug("Creating new status : " + content);
        }
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        Status status = statusRepository.createStatus(currentLogin, content);

        // add status to the dayline, userline, timeline, tagline
        statusRepository.addStatusToDayline(status, DAYLINE_KEY_FORMAT.format(status.getStatusDate()));
        statusRepository.addStatusToUserline(status);
        statusRepository.addStatusToTimeline(currentLogin, status);
        statusRepository.addStatusToTagline(status);

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

    public Collection<Status> buildStatusList(Collection<String> statusIds) {
        String login = authenticationService.getCurrentUser().getLogin();
        Collection<String> favoriteIds = statusRepository.getFavoritesline(login);
        Collection<Status> statuses = new ArrayList<Status>(statusIds.size());
        for (String statusId : statusIds) {
            Status status = this.statusRepository.findStatusById(statusId);
            if (status == null) {
                this.log.debug("Invisible status : " + statusId);
                continue;
            }
            // if the Status comes from ehcache, it has to be cloned to another instance
            // in order to be thread-safe.
            // ehcache shares the Status instances per statusId, but favorites are per user.
            Status statusCopy = new Status();
            statusCopy.setStatusId(status.getStatusId());
            statusCopy.setContent(status.getContent());
            statusCopy.setLogin(status.getLogin());
            statusCopy.setStatusDate(status.getStatusDate());
            if (favoriteIds.contains(statusId)) {
                statusCopy.setFavorite(true);
            } else {
                statusCopy.setFavorite(false);
            }
            User statusUser = userService.getUserByLogin(status.getLogin());
            statusCopy.setFirstName(statusUser.getFirstName());
            statusCopy.setLastName(statusUser.getLastName());
            statusCopy.setGravatar(statusUser.getGravatar());
            statuses.add(statusCopy);
        }
        return statuses;
    }

    /**
     * The dayline contains a day's status
     *
     * @param date the day's name to retrieve the status of
     * @return a status list
     */
    public Collection<Status> getDayline(String date) {
        if (date == null || date.isEmpty() || !date.matches("^\\d{8}$")) {
            date = DAYLINE_KEY_FORMAT.format(new Date());
        }
        Collection<String> statusIds = this.statusRepository.getDayline(date);

        return this.buildStatusList(statusIds);
    }

    /**
     * The dayline contains a day's status
     *
     * @param date the day to retrieve the status of
     * @return a status list
     */
    public Collection<Status> getDayline(Date date) {
        if (date == null) date = new Date();
        Collection<String> statusIds = this.statusRepository.getDayline(DAYLINE_KEY_FORMAT.format(date));

        return this.buildStatusList(statusIds);
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
        Collection<String> statusIds = this.statusRepository.getTagline(tag, nbStatus);

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
     * @param login    the user to retrieve the userline of
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<Status> getUserline(String login, int nbStatus, String since_id, String max_id) {
        if (login == null || login.isEmpty()) {
            User currentUser = this.authenticationService.getCurrentUser();
            login = currentUser.getLogin();
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
            String content = '@' + currentUser.getLogin() + " liked your status<br/><em>_PH_...</em>";
            int maxLength = 140 - content.length() + 4;
            if (status.getContent().length() > maxLength) {
                content = content.replace("_PH_", status.getContent().substring(0, maxLength));
            } else {
                content = content.replace("_PH_", status.getContent());
            }

            Status helloStatus = this.statusRepository.createStatus(status.getLogin(), content); // removable
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

    public void setAuthenticationService(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    private String extractLoginWithoutAt(String dest) {
        return dest.substring(1, dest.length());
    }

}
