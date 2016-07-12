package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.security.DomainViolationException;
import fr.ippon.tatami.service.dto.StatusDTO;
import fr.ippon.tatami.service.util.DomainUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import fr.ippon.tatami.domain.status.*;

import javax.inject.Inject;
import java.util.*;

/**
 * Manages the timeline.
 *
 * @author Julien Dubois
 */
@Service
public class TimelineService {

    private static final Logger log = LoggerFactory.getLogger(TimelineService.class);

    private static final String hashtagDefault = "---";

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
    private DomainlineRepository domainlineRepository;

    @Inject
    private DomainRepository domainRepository;

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private GroupService groupService;

    @Inject
    private SearchService searchService;

    @Inject
    private AtmosphereService atmosphereService;

    @Inject
    private BlockService blockService;

    public StatusDTO getStatus(String statusId) {
        List<String> line = new ArrayList<String>();
        line.add(statusId);
        Collection<StatusDTO> statusCollection = buildStatusList(line);
        if (statusCollection.isEmpty()) {
            return null;
        } else {
            StatusDTO statusDTO = statusCollection.iterator().next();
            // Private message check
            if (statusDTO.isStatusPrivate()) {
                String login = authenticationService.getCurrentUser().getLogin();
                if (!timelineRepository.isStatusInTimeline(login, statusId)) {
                    log.info("User " + login + " tried to access private message ID " + statusId);
                    return null;
                }
            }
            return statusDTO;
        }
    }

    /**
     * Get the details for a status
     * - Who shared this status
     * - The discussion in which this status belongs to
     */
    public StatusDetails getStatusDetails(String statusId) {
        log.debug("Looking for status details");
        StatusDetails details = new StatusDetails();

        AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
        if (abstractStatus == null) {
            log.debug("Status could not be found");
            return null;
        }
        Status status = null;
        if (abstractStatus.getType() == null || abstractStatus.getType().equals(StatusType.STATUS)) {
            status = (Status) abstractStatus;
        } else if (abstractStatus.getType().equals(StatusType.SHARE)) {
            Share share = (Share) abstractStatus;
            AbstractStatus originalStatus = statusRepository.findStatusById(share.getOriginalStatusId());
            if (originalStatus == null) {
                log.debug("Original Status could not be found");
                return details;
            } else if (originalStatus.getType() != null && !originalStatus.getType().equals(StatusType.STATUS)) {
                log.debug("Original status does not have the correct type");
                return details;
            }
            status = (Status) originalStatus;
        } else if (abstractStatus.getType().equals(StatusType.ANNOUNCEMENT)) {
            Announcement announcement = (Announcement) abstractStatus;
            AbstractStatus originalStatus = statusRepository.findStatusById(announcement.getOriginalStatusId());
            if (originalStatus == null) {
                log.debug("Original Status could not be found");
                return details;
            } else if (originalStatus.getType() != null && !originalStatus.getType().equals(StatusType.STATUS)) {
                log.debug("Original status does not have the correct type");
                return details;
            }
            status = (Status) originalStatus;
        } else {
            log.debug("Status does not have the correct type");
            return details;
        }
        details.setStatusId(status.getStatusId());

        // Shares management
        Collection<String> sharedByLogins = sharesRepository.findLoginsWhoSharedAStatus(status.getStatusId());
        details.setSharedByLogins(userService.getUsersByLogin(sharedByLogins));
        log.debug("Status shared by {} users", sharedByLogins.size());

        // Discussion management
        Collection<String> statusIdsInDiscussion = new LinkedHashSet<String>();
        String replyTo = status.getReplyTo();
        if (replyTo != null && !replyTo.equals("")) { // If this is a reply, get the original discussion
            // Add the original discussion
            statusIdsInDiscussion.add(status.getDiscussionId());
            // Add the replies
            statusIdsInDiscussion.addAll(discussionRepository.findStatusIdsInDiscussion(status.getDiscussionId()));
            // Remove the current status from the list
            statusIdsInDiscussion.remove(status.getStatusId());
        } else { // This is the original discussion
            // Add the replies
            statusIdsInDiscussion.addAll(discussionRepository.findStatusIdsInDiscussion(status.getStatusId()));
        }

        // Transform the Set to a Map<String, String>
        List<String> line = new ArrayList<String>();
        for (String statusIdInDiscussion : statusIdsInDiscussion) {
            line.add(statusIdInDiscussion);
        }
        // Enrich the details object with the complete statuses in the discussion
        Collection<StatusDTO> statusesInDiscussion = buildStatusList(line);
        details.setDiscussionStatuses(statusesInDiscussion);
        return details;
    }

    public Collection<StatusDTO> buildStatusList(List<String> line) {
        User currentUser = null;
        Collection<Group> usergroups;
        List<String> favoriteLine;
        if (authenticationService.hasAuthenticatedUser()) {
            currentUser = authenticationService.getCurrentUser();
            usergroups = groupService.getGroupsForUser(currentUser);
            favoriteLine = favoritelineRepository.getFavoriteline(currentUser.getLogin());
        } else {
            usergroups = Collections.emptyList();
            favoriteLine = Collections.emptyList();
        }
        Collection<StatusDTO> statuses = new ArrayList<StatusDTO>(line.size());
        for (String statusId : line) {
            AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
            if (abstractStatus != null) {
                User statusUser = userService.getUserByLogin(abstractStatus.getLogin());
                if (statusUser != null) {
                    // Security check
                    // bypass the security check when no user is logged in 
                    // => for non-authenticated rss access 
                    if ((currentUser != null) && !statusUser.getDomain().equals(currentUser.getDomain())) {
                        throw new DomainViolationException("User " + currentUser + " tried to access " +
                                " status : " + abstractStatus);
                    }

                    StatusDTO statusDTO = new StatusDTO();
                    statusDTO.setStatusId(abstractStatus.getStatusId());
                    statusDTO.setStatusDate(abstractStatus.getStatusDate());
                    statusDTO.setGeoLocalization(abstractStatus.getGeoLocalization());
                    statusDTO.setActivated(statusUser.getActivated());
                    StatusType type = abstractStatus.getType();
                    if (type == null) {
                        statusDTO.setType(StatusType.STATUS);
                    } else {
                        statusDTO.setType(abstractStatus.getType());
                    }

                    if (abstractStatus.getType().equals(StatusType.SHARE)) {
                        Share share = (Share) abstractStatus;
                        AbstractStatus originalStatus = statusRepository.findStatusById(share.getOriginalStatusId());
                        if (originalStatus != null) { // Find the original status
                            statusDTO.setTimelineId(share.getStatusId());
                            statusDTO.setSharedByUsername(share.getUsername());
                            statusUser = userService.getUserByLogin(originalStatus.getLogin());
                            addStatusToLine(statuses, statusDTO, originalStatus, statusUser, usergroups, favoriteLine);
                        } else {
                            log.debug("Original status has been deleted");
                        }
                    } else if (abstractStatus.getType().equals(StatusType.MENTION_SHARE)) {
                        MentionShare mentionShare = (MentionShare) abstractStatus;
                        AbstractStatus originalStatus = statusRepository.findStatusById(mentionShare.getOriginalStatusId());
                        if (originalStatus != null) { // Find the status that was shared
                            statusDTO.setTimelineId(mentionShare.getStatusId());
                            statusDTO.setSharedByUsername(mentionShare.getUsername());
                            statusUser = userService.getUserByLogin(mentionShare.getLogin());
                            addStatusToLine(statuses, statusDTO, originalStatus, statusUser, usergroups, favoriteLine);
                        } else {
                            log.debug("Mentioned status has been deleted");
                        }
                    } else if (abstractStatus.getType().equals(StatusType.MENTION_FRIEND)) {
                        MentionFriend mentionFriend = (MentionFriend) abstractStatus;
                        statusDTO.setTimelineId(mentionFriend.getStatusId());
                        //statusDTO.setSharedByUsername(mentionFriend.getUsername());
                        statusUser = userService.getUserByLogin(mentionFriend.getFollowerLogin());
                        statusDTO.setFirstName(statusUser.getFirstName());
                        statusDTO.setLastName(statusUser.getLastName());
                        statusDTO.setAvatar(statusUser.getAvatar());
                        statusDTO.setUsername(statusUser.getUsername());
                        statuses.add(statusDTO);
                    } else if (abstractStatus.getType().equals(StatusType.ANNOUNCEMENT)) {
                        Announcement announcement = (Announcement) abstractStatus;
                        AbstractStatus originalStatus = statusRepository.findStatusById(announcement.getOriginalStatusId());
                        if (originalStatus != null) { // Find the status that was announced
                            statusDTO.setTimelineId(announcement.getStatusId());
                            statusDTO.setSharedByUsername(announcement.getUsername());
                            statusUser = userService.getUserByLogin(originalStatus.getLogin());
                            addStatusToLine(statuses, statusDTO, originalStatus, statusUser, usergroups, favoriteLine);
                        } else {
                            log.debug("Announced status has been deleted");
                        }
                    } else { // Normal status
                        statusDTO.setTimelineId(abstractStatus.getStatusId());
                        addStatusToLine(statuses, statusDTO, abstractStatus, statusUser, usergroups, favoriteLine);
                    }
                } else {
                    log.debug("Deleted user : {}", abstractStatus.getLogin());
                }
            } else {
                log.debug("Deleted status : {}", statusId);
            }
        }

        for(StatusDTO statusDTO : statuses)
            statusDTO.setShareByMe(shareByMe(statusDTO));

        return statuses;
    }

    //@Cacheable("isSharedByMe")
    private Boolean shareByMe(StatusDTO statusDTO)
    {
        Boolean isSharedByMe;

        Collection<String> loginWhoShare = sharesRepository.findLoginsWhoSharedAStatus(statusDTO.getStatusId());
        User currentUser = authenticationService.getCurrentUser();
        if(loginWhoShare.contains(currentUser.getLogin()) )
            isSharedByMe = true;
        else if(currentUser.getUsername().equals(statusDTO.getSharedByUsername())) //Greg ce n'est pas normal de devoir faire ça
            isSharedByMe = true;
        else
            isSharedByMe = false;

        return isSharedByMe;
    }

    /**
     * Find old statuses.
     *
     * Statuses might not be up to date on the current line : they might have been deleted, or the user has lost the
     * permission to see them.
     */
    private Collection<String> findStatusesToCleanUp(List<String> statuses, Collection<StatusDTO> dtos) {
        Collection<String> statusIdsToCleanUp = new ArrayList<String>();
        for (String statusId : statuses) {
            boolean statusToDelete = true;
            for (StatusDTO statusDTO : dtos) {
                if (statusDTO.getStatusId().equals(statusId)) {
                    statusToDelete = false;
                }
            }
            if (statusToDelete) {
                statusIdsToCleanUp.add(statusId);
            }
        }
        return statusIdsToCleanUp;
    }

    private void addStatusToLine(Collection<StatusDTO> line,
                                 StatusDTO statusDTO,
                                 AbstractStatus abstractStatus,
                                 User statusUser,
                                 Collection<Group> usergroups,
                                 List<String> favoriteLine) {

        Status status = (Status) abstractStatus;
        // Group check
        boolean hiddenStatus = false;
        if (status.getGroupId() != null) {
            statusDTO.setGroupId(status.getGroupId());
            Group group = groupService.getGroupById(statusUser.getDomain(), statusDTO.getGroupId());
            // if this is a private group and the user is not part of it, he cannot see the status
            if (!group.isPublicGroup() && !usergroups.contains(group)) {
                hiddenStatus = true;
            } else {
                statusDTO.setPublicGroup(group.isPublicGroup());
                statusDTO.setGroupName(group.getName());
            }
        }

        if (!hiddenStatus) {
            if (status.getHasAttachments() != null && status.getHasAttachments()) {
                statusDTO.setAttachments(status.getAttachments());
            }
            statusDTO.setContent(status.getContent());
            statusDTO.setUsername(statusUser.getUsername());
            if (status.getStatusPrivate() == null) {
                statusDTO.setStatusPrivate(false);
            } else {
                statusDTO.setStatusPrivate(status.getStatusPrivate());
            }
            statusDTO.setReplyTo(status.getReplyTo());
            statusDTO.setReplyToUsername(status.getReplyToUsername());
            if (favoriteLine.contains(statusDTO.getStatusId())) {
                statusDTO.setFavorite(true);
            } else {
                statusDTO.setFavorite(false);
            }
            statusDTO.setFirstName(statusUser.getFirstName());
            statusDTO.setLastName(statusUser.getLastName());
            statusDTO.setAvatar(statusUser.getAvatar());
            statusDTO.setDetailsAvailable(status.isDetailsAvailable());
            line.add(statusDTO);
        }
    }

    /**
     * The mentionline contains a statuses where the current user is mentioned.
     *
     * @return a status list
     */
    public Collection<StatusDTO> getMentionline(int nbStatus, String start, String finish) {
        User currentUser = authenticationService.getCurrentUser();
        List<String> statuses =
                mentionlineRepository.getMentionline(currentUser.getLogin(), nbStatus, start, finish);

        Collection<StatusDTO> dtos = buildStatusList(statuses);
        if (statuses.size() != dtos.size()) {
            Collection<String> statusIdsToDelete = findStatusesToCleanUp(statuses, dtos);
            mentionlineRepository.removeStatusesFromMentionline(currentUser.getLogin(), statusIdsToDelete);
            return getMentionline(nbStatus, start, finish);
        }
        dtos = removeStatusFromBlockedUsers(dtos);
        return dtos;
    }

    /**
     * The tagline contains a tag's statuses
     *
     * @param tag      the tag to retrieve the timeline of
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<StatusDTO> getTagline(String tag, int nbStatus, String start, String finish) {
        if (tag == null || tag.isEmpty()) {
            tag = hashtagDefault;
        }
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        List<String> statuses = taglineRepository.getTagline(domain, tag, nbStatus, start, finish);

        Collection<StatusDTO> dtos = buildStatusList(statuses);
        if (statuses.size() != dtos.size()) {
            Collection<String> statusIdsToDelete = findStatusesToCleanUp(statuses, dtos);
            taglineRepository.removeStatusesFromTagline(tag, domain, statusIdsToDelete);
            return getTagline(tag, nbStatus, start, finish);
        }
        dtos = removeStatusFromBlockedUsers(dtos);
        return dtos;
    }

    /**
     * The groupline contains a group's statuses.
     *
     * @return a status list
     */
    public Collection<StatusDTO> getGroupline(String groupId, Integer nbStatus, String start, String finish) {
        List<String> statuses = grouplineRepository.getGroupline(groupId, nbStatus, start, finish);
        Collection<StatusDTO> dtos = buildStatusList(statuses);
        if (statuses.size() != dtos.size()) {
            Collection<String> statusIdsToDelete = findStatusesToCleanUp(statuses, dtos);
            grouplineRepository.removeStatusesFromGroupline(groupId, statusIdsToDelete);
            return getGroupline(groupId, nbStatus, start, finish);
        }
        dtos = removeStatusFromBlockedUsers(dtos);
        return dtos;
    }

    /**
     * The timeline contains the user's status merged with his friends status
     *
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<StatusDTO> getTimeline(int nbStatus, String start, String finish) {
        String login = authenticationService.getCurrentUser().getLogin();
        return getUserTimeline(login, nbStatus, start, finish);
    }

    /**
     * The timeline contains the user's status merged with his friends status.
     *
     * getUserTimeline returns the time line for an arbitrary user (and not only
     * the logged-in user).
     *
     * This is used for RSS syndication.
     *
     * @param login    of the user we want the timeline of
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<StatusDTO> getUserTimeline(String login, int nbStatus, String start, String finish) {
        List<String> statuses =
                timelineRepository.getTimeline(login, nbStatus, start, finish);

        Collection<StatusDTO> dtos = buildStatusList(statuses);
        if (statuses.size() != dtos.size()) {
            Collection<String> statusIdsToDelete = findStatusesToCleanUp(statuses, dtos);
            timelineRepository.removeStatusesFromTimeline(login, statusIdsToDelete);
            return getTimeline(nbStatus, start, finish);
        }
        dtos = removeStatusFromBlockedUsers(dtos);
        return dtos;
    }

    /**
     * The domainline contains all the public statuses of the domain (status with no group, or
     * in a public group), for the last 30 days.
     *
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<StatusDTO> getDomainline(int nbStatus, String start, String finish) {
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        List<String> statuses =
                domainlineRepository.getDomainline(domain, nbStatus, start, finish);

        Collection<StatusDTO> dtos = buildStatusList(statuses);
        if (statuses.size() != dtos.size()) {
            Collection<String> statusIdsToDelete = findStatusesToCleanUp(statuses, dtos);
            domainlineRepository.removeStatusFromDomainline(domain, statusIdsToDelete);
            return getDomainline(nbStatus, start, finish);
        }
        dtos = removeStatusFromBlockedUsers(dtos);
        return dtos;
    }


    /**
     * The userline contains the user's own status
     *
     * @param username the user to retrieve the userline of
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<StatusDTO> getUserline(String username, int nbStatus, String start, String finish) {
        String login;
        User currentUser = authenticationService.getCurrentUser();
        if (username == null || username.isEmpty()) { // current user
            login = currentUser.getLogin();
        } else {  // another user, in the same domain
            String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
            login = DomainUtil.getLoginFromUsernameAndDomain(username, domain);
        }
        List<String> statuses = userlineRepository.getUserline(login, nbStatus, start, finish);
        Collection<StatusDTO> dtos = buildStatusList(statuses);
        if (statuses.size() != dtos.size()) {
            Collection<String> statusIdsToDelete = findStatusesToCleanUp(statuses, dtos);
            userlineRepository.removeStatusesFromUserline(login, statusIdsToDelete);
            return getUserline(username, nbStatus, start, finish);
        }
        dtos = removeStatusFromBlockedUsers(dtos);
        return dtos;
    }

    public void removeStatus(String statusId) {
        log.debug("Removing status : {}", statusId);
        AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
        if (abstractStatus != null && abstractStatus.getType().equals(StatusType.STATUS)) {
            Status status = (Status) abstractStatus;
            User currentUser = authenticationService.getCurrentUser();
            if (status.getLogin().equals(currentUser.getLogin()) || authenticationService.isCurrentUserInRole("ADMIN")) {
                statusRepository.removeStatus(status);
                counterRepository.decrementStatusCounter(currentUser.getLogin());
                searchService.removeStatus(status);
            }
        } else if (abstractStatus.getType().equals(StatusType.ANNOUNCEMENT)) {
            User currentUser = authenticationService.getCurrentUser();
            if (abstractStatus.getLogin().equals(currentUser.getLogin())) {
                statusRepository.removeStatus(abstractStatus);
            }
        } else {
            log.debug("Cannot remove status of this type");
        }
    }

    public void shareStatus(String statusId) {
        log.debug("Share status : {}", statusId);
        String currentLogin = this.authenticationService.getCurrentUser().getLogin();
        AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
        if (abstractStatus != null) {
            if (abstractStatus.getType().equals(StatusType.STATUS)) {
                Status status = (Status) abstractStatus;
                internalShareStatus(currentLogin, status);
            } else if (abstractStatus.getType().equals(StatusType.SHARE)) {
                Share currentShare = (Share) abstractStatus;
                // We share the original status
                Status originalStatus = (Status) statusRepository.findStatusById(currentShare.getOriginalStatusId());
                internalShareStatus(currentLogin, originalStatus);
            } else {
                log.warn("Cannot share this type of status: " + abstractStatus);
            }
        } else {
            log.debug("Cannot share this status, as it does not exist: {}", abstractStatus);
        }
    }

    private void internalShareStatus(String currentLogin, Status status) {
        // create share
        Share share = statusRepository.createShare(currentLogin, status.getStatusId());

        // add status to the user's userline and timeline
        userlineRepository.shareStatusToUserline(currentLogin, share);
        shareStatusToTimelineAndNotify(currentLogin, currentLogin, share);
        // add status to the follower's timelines
        Collection<String> followersForUser = followerRepository.findFollowersForUser(currentLogin);
        for (String followerLogin : followersForUser) {
            shareStatusToTimelineAndNotify(currentLogin, followerLogin, share);
        }
        // update the status details to add this share
        sharesRepository.newShareByLogin(status.getStatusId(), currentLogin);
        // mention the status' author that the user has shared his status
        MentionShare mentionShare = statusRepository.createMentionShare(currentLogin, status.getStatusId());
        mentionlineRepository.addStatusToMentionline(status.getLogin(), mentionShare.getStatusId());
    }

    public void addFavoriteStatus(String statusId) {
        log.debug("Favorite status : {}", statusId);
        AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
        if (abstractStatus.getType().equals(StatusType.STATUS)) {
            String login = authenticationService.getCurrentUser().getLogin();
            favoritelineRepository.addStatusToFavoriteline(login, statusId);
        } else {
            log.warn("Cannot favorite this type of status: " + abstractStatus);
        }
    }

    public void removeFavoriteStatus(String statusId) {
        log.debug("Un-favorite status : {}", statusId);
        AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
        if (abstractStatus.getType().equals(StatusType.STATUS)) {
            User currentUser = authenticationService.getCurrentUser();
            favoritelineRepository.removeStatusFromFavoriteline(currentUser.getLogin(), statusId);
        } else {
            log.warn("Cannot un-favorite this type of status: " + abstractStatus);
        }
    }

    public void announceStatus(String statusId) {
        log.debug("Announce status : {}", statusId);
        String currentLogin = this.authenticationService.getCurrentUser().getLogin();
        AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
        if (abstractStatus != null) {
            if (abstractStatus.getType().equals(StatusType.STATUS)) {
                Status status = (Status) abstractStatus;
                internalAnnounceStatus(currentLogin, status);
            } else if (abstractStatus.getType().equals(StatusType.SHARE)) {
                Share currentShare = (Share) abstractStatus;
                // We announce the original status
                Status originalStatus = (Status) statusRepository.findStatusById(currentShare.getOriginalStatusId());
                internalAnnounceStatus(currentLogin, originalStatus);
            } else {
                log.warn("Cannot announce this type of status: " + abstractStatus);
            }
        } else {
            log.debug("Cannot announce this status, as it does not exist: {}", abstractStatus);
        }
    }

    private void internalAnnounceStatus(String currentLogin, Status status) {
        // create announcement
        Announcement announcement = statusRepository.createAnnouncement(currentLogin, status.getStatusId());

        // add status to everyone's timeline
        String domain = DomainUtil.getDomainFromLogin(currentLogin);
        List<String> logins = domainRepository.getLoginsInDomain(domain);
        timelineRepository.announceStatusToTimeline(currentLogin, logins, announcement);
        for (String login : logins) {
            atmosphereService.notifyUser(login, announcement);
        }
    }

    /**
     * The favline contains the user's favorites status
     *
     * @return a status list
     */
    public Collection<StatusDTO> getFavoritesline() {
        String currentLogin = authenticationService.getCurrentUser().getLogin();
        List<String> statuses = favoritelineRepository.getFavoriteline(currentLogin);
        Collection<StatusDTO> dtos = buildStatusList(statuses);
        if (statuses.size() != dtos.size()) {
            Collection<String> statusIdsToDelete = findStatusesToCleanUp(statuses, dtos);
            for (String statusId : statusIdsToDelete) {
                favoritelineRepository.removeStatusFromFavoriteline(currentLogin, statusId);
            }
            return getFavoritesline();
        }
        dtos = removeStatusFromBlockedUsers(dtos);
        return dtos;
    }

    /**
     * Adds the status to the timeline and notifies the user with Atmosphere.
     */
    private void shareStatusToTimelineAndNotify(String sharedByLogin, String timelineLogin, Share share) {
        timelineRepository.shareStatusToTimeline(sharedByLogin, timelineLogin, share);
        atmosphereService.notifyUser(timelineLogin, share);
    }

    private Collection<StatusDTO> removeStatusFromBlockedUsers(Collection<StatusDTO> dtos){
        if(authenticationService.hasAuthenticatedUser()) {
            User currentUser = authenticationService.getCurrentUser();
            String currentLogin = currentUser.getLogin();
            String domain = DomainUtil.getDomainFromLogin(currentLogin);
            Collection<String> blockedUsers = blockService.getUsersBlockedLoginForUser(currentLogin);
            Collection<StatusDTO> newDtos = new ArrayList<StatusDTO>();
            for (StatusDTO dto : dtos) {
                if (!blockedUsers.contains(dto.getUsername() + "@" + domain)) {
                    newDtos.add(dto);
                }
            }
            return newDtos;
        }
        return dtos;

    }
}
