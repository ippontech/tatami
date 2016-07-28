package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.status.*;
import fr.ippon.tatami.exception.NoUserFoundException;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.DomainViolationException;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.StatusDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

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
    private BlockService blockService;

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
    private GroupService groupService;

    @Inject
    private UserRepository userRepository;

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
                String email = SecurityUtils.getCurrentUserEmail();
                if (!timelineRepository.isStatusInTimeline(email, statusId)) {
                    log.info("User " + email + " tried to access private message ID " + statusId);
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
        } else if (abstractStatus.getType().equals(StatusType.SHARE) || abstractStatus.getType().equals(StatusType.ANNOUNCEMENT)) {
            //An announcement is a share
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
        } else {
            log.debug("Status does not have the correct type");
            return details;
        }
        details.setStatusId(status.getStatusId().toString());

        // Shares management
        Collection<String> sharedByEmails = sharesRepository.findUserEmailsWhoSharedAStatus(status.getStatusId().toString());
        details.setSharedByEmails(userService.getUsersByEmail(sharedByEmails));
        log.debug("Status shared by {} users", sharedByEmails.size());

        // Discussion management
        List<String> statusIdsInDiscussion = new ArrayList<String>();
        String replyTo = status.getReplyTo();
        if (replyTo != null && !replyTo.equals("")) { // If this is a reply, get the original discussion
            // Add the original discussion
            statusIdsInDiscussion.add(status.getDiscussionId());
            // Add the replies
            statusIdsInDiscussion.addAll(discussionRepository.findStatusIdsInDiscussion(status.getDiscussionId()));
            // Remove the current status from the list
            statusIdsInDiscussion.remove(status.getStatusId().toString());
        } else { // This is the original discussion
            // Add the replies
            statusIdsInDiscussion.addAll(discussionRepository.findStatusIdsInDiscussion(status.getStatusId().toString()));
        }

        // Transform the List to a Map<String, String>
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
        Collection<Group> usergroups = Collections.emptyList();
        List<String> favoriteLine = Collections.emptyList();
        if (SecurityUtils.isAuthenticated()) {
            currentUser = userService.getCurrentUser().get();
            usergroups = groupService.getGroupsForUser(currentUser);
            favoriteLine = favoritelineRepository.getFavoriteline(currentUser.getEmail());
        }
        Collection<StatusDTO> statuses = new ArrayList<>(line.size());
        for (String statusId : line) {
            AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
            if (abstractStatus != null) {
                User statusUser = userRepository.findOneByEmail(abstractStatus.getEmail()).get();
                if (statusUser != null) {
                    // Security check
                    // bypass the security check when no user is logged in
                    // => for non-authenticated rss access
                    if ((currentUser != null) && !statusUser.getDomain().equals(currentUser.getDomain())) {
                        throw new DomainViolationException("User " + currentUser + " tried to access " +
                            " status : " + abstractStatus);
                    }

                    StatusDTO statusDTO = buildStatusDTOFromAbstractStatus(abstractStatus, statusUser, currentUser);
                    StatusType type = abstractStatus.getType();
                    if (type == null) {
                        statusDTO.setType(StatusType.STATUS);
                    } else {
                        statusDTO.setType(type);
                    }

                    if (abstractStatus.getType().equals(StatusType.SHARE)) {
                        Share share = (Share) abstractStatus;
                        AbstractStatus originalStatus = statusRepository.findStatusById(share.getOriginalStatusId());
                        if (originalStatus != null) { // Find the original status
                            setStatusDTOFromShare(statusDTO, share,  statusUser,  currentUser);
                            statusUser = userRepository.findOneByEmail(originalStatus.getEmail()).get();
                            addStatusToLine(statuses, statusDTO, originalStatus, statusUser, usergroups, favoriteLine);
                        } else {
                            log.debug("Original status has been deleted");
                        }
                    } else if (abstractStatus.getType().equals(StatusType.MENTION_SHARE)) {
                        MentionShare mentionShare = (MentionShare) abstractStatus;
                        AbstractStatus originalStatus = statusRepository.findStatusById(mentionShare.getOriginalStatusId());
                        if (originalStatus != null) { // Find the status that was shared
                            statusDTO.setTimelineId(mentionShare.getStatusId().toString());
                            statusDTO.setSharedByUsername(mentionShare.getUsername());
                            statusUser = userRepository.findOneByEmail(mentionShare.getEmail()).get();
                            addStatusToLine(statuses, statusDTO, originalStatus, statusUser, usergroups, favoriteLine);
                        } else {
                            log.debug("Mentioned status has been deleted");
                        }
                    } else if (abstractStatus.getType().equals(StatusType.MENTION_FRIEND)) {
                        MentionFriend mentionFriend = (MentionFriend) abstractStatus;
                        setStatusDTOFromMentionFriend(statusDTO, mentionFriend, statusUser);
                        statuses.add(statusDTO);
                    } else if (abstractStatus.getType().equals(StatusType.ANNOUNCEMENT)) {
                        Announcement announcement = (Announcement) abstractStatus;
                        AbstractStatus originalStatus = statusRepository.findStatusById(announcement.getOriginalStatusId());
                        if (originalStatus != null) { // Find the status that was announced
                            //An announcement is a share
                            setStatusDTOFromShare(statusDTO, announcement, statusUser, currentUser);
                            statusUser = userRepository.findOneByEmail(originalStatus.getEmail()).get();
                            addStatusToLine(statuses, statusDTO, originalStatus, statusUser, usergroups, favoriteLine);
                        } else {
                            log.debug("Announced status has been deleted");
                        }
                    } else { // Normal status
                        statusDTO.setTimelineId(abstractStatus.getStatusId().toString());
                        addStatusToLine(statuses, statusDTO, abstractStatus, statusUser, usergroups, favoriteLine);
                    }
                } else {
                    log.debug("Deleted user : {}", abstractStatus.getEmail());
                }
            } else {
                log.debug("Deleted status : {}", statusId);
            }
        }

        for (StatusDTO statusDTO : statuses)
            statusDTO.setShareByMe(shareByMe(statusDTO));

        return statuses;
    }

    private StatusDTO buildStatusDTOFromAbstractStatus(AbstractStatus abstractStatus, User statusUser, User currentUser){
        StatusDTO statusDTO = new StatusDTO();
        statusDTO.setStatusId(abstractStatus.getStatusId().toString());
        statusDTO.setStatusDate(abstractStatus.getStatusDate());
        statusDTO.setGeoLocalization(abstractStatus.getGeoLocalization());
        statusDTO.setActivated(statusUser.getActivated());
        statusDTO.setYours(statusUser.equals(currentUser));
        return statusDTO;
    }

    private void setStatusDTOFromShare(StatusDTO statusDTO, Share share, User statusUser, User currentUser){
        statusDTO.setTimelineId(share.getStatusId().toString());
        statusDTO.setSharedByUsername(share.getUsername());
        statusDTO.setYours(statusUser.equals(currentUser));
    }

    private void setStatusDTOFromMentionFriend(StatusDTO statusDTO, MentionFriend mentionFriend, User statusUser){
        statusDTO.setTimelineId(mentionFriend.getStatusId().toString());
        statusDTO.setSharedByUsername(mentionFriend.getUsername());
        statusUser = userRepository.findOneByEmail(mentionFriend.getfollowerUsername() + "@" + statusUser.getDomain()).get();
        statusDTO.setFirstName(statusUser.getFirstName());
        statusDTO.setLastName(statusUser.getLastName());
        statusDTO.setAvatar(statusUser.getAvatar());
        statusDTO.setUsername(statusUser.getUsername());
    }

    //@Cacheable("isSharedByMe")
    private Boolean shareByMe(StatusDTO statusDTO) {
        Boolean isSharedByMe;

        Collection<String> userEmailWhoShare = sharesRepository.findUserEmailsWhoSharedAStatus(statusDTO.getStatusId());
        User currentUser = userService.getCurrentUser().get();
        if (userEmailWhoShare.contains(currentUser.getEmail()))
            isSharedByMe = true;
        else if (currentUser.getUsername().equals(statusDTO.getSharedByUsername())) //Greg ce n'est pas normal de devoir faire ça
            isSharedByMe = true;
        else
            isSharedByMe = false;

        return isSharedByMe;
    }

    /**
     * Find old statuses.
     * <p>
     * Statuses might not be up to date on the current line : they might have been deleted, or the user has lost the
     * permission to see them.
     */
    private Collection<String> findStatusesToCleanUp(List<String> statuses, Collection<StatusDTO> dtos) {
        Collection<String> statusIdsToCleanUp = new ArrayList<>();
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
            Group group = groupService.getGroupById(statusUser.getDomain(), UUID.fromString(statusDTO.getGroupId()));
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
        User currentUser = userService.getCurrentUser().get();
        List<String> statuses =
            mentionlineRepository.getMentionline(currentUser.getEmail(), nbStatus, start, finish);

        Collection<StatusDTO> dtos = buildStatusList(statuses);
        if (statuses.size() != dtos.size()) {
            Collection<String> statusIdsToDelete = findStatusesToCleanUp(statuses, dtos);
            mentionlineRepository.removeStatusesFromMentionline(currentUser.getEmail(), statusIdsToDelete);
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
        String domain = SecurityUtils.getCurrentUserDomain();
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
        String email = SecurityUtils.getCurrentUserEmail();
        return getUserTimeline(email, nbStatus, start, finish);
    }

    /**
     * The timeline contains the user's status merged with his friends status.
     * <p>
     * getUserTimeline returns the time line for an arbitrary user (and not only
     * the logged-in user).
     * <p>
     * This is used for RSS syndication.
     *
     * @param email    Email address of the user we want the timeline of
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<StatusDTO> getUserTimeline(String email, int nbStatus, String start, String finish) {
        List<String> statuses =
            timelineRepository.getTimeline(email, nbStatus, start, finish);

        Collection<StatusDTO> dtos = buildStatusList(statuses);
        if (statuses.size() != dtos.size()) {
            Collection<String> statusIdsToDelete = findStatusesToCleanUp(statuses, dtos);
            timelineRepository.removeStatusesFromTimeline(email, statusIdsToDelete);
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
        String domain = SecurityUtils.getCurrentUserDomain();
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
     * @param email    the email of hte user to retrieve the userline of
     * @param nbStatus the number of status to retrieve, starting from most recent ones
     * @return a status list
     */
    public Collection<StatusDTO> getUserline(String email, int nbStatus, String start, String finish) throws NoUserFoundException {
        Optional<User> optionalUser = userRepository.findOneByEmail(email);
        if (optionalUser.isPresent()) {
            List<String> statuses = userlineRepository.getUserline(email, nbStatus, start, finish);
            Collection<StatusDTO> dtos = buildStatusList(statuses);
            if (statuses.size() != dtos.size()) {
                Collection<String> statusIdsToDelete = findStatusesToCleanUp(statuses, dtos);
                userlineRepository.removeStatusesFromUserline(email, statusIdsToDelete);
                return getUserline(email, nbStatus, start, finish);
            }
            dtos = removeStatusFromBlockedUsers(dtos);
            return dtos;
        } else {
            throw new NoUserFoundException();
        }


    }

    public void removeStatus(String statusId) {
        log.debug("Removing status : {}", statusId);
        AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
        if (abstractStatus != null && abstractStatus.getType().equals(StatusType.STATUS)) {
            Status status = (Status) abstractStatus;
            User currentUser = userService.getCurrentUser().get();
            if (status.getUsername().equals(currentUser.getUsername())) {
                statusRepository.removeStatus(status);
                counterRepository.decrementStatusCounter(currentUser.getEmail());
//                searchService.removeStatus(status);
            }
        } else if (abstractStatus.getType().equals(StatusType.ANNOUNCEMENT)) {
            User currentUser = userService.getCurrentUser().get();
            if (abstractStatus.getUsername().equals(currentUser.getUsername())) {
                statusRepository.removeStatus(abstractStatus);
            }
        } else {
            log.debug("Cannot remove status of this type");
        }
    }

    public void shareStatus(String statusId) {
        log.debug("Share status : {}", statusId);
        String currentEmail = SecurityUtils.getCurrentUserEmail();
        AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
        if (abstractStatus != null) {
            if (abstractStatus.getType().equals(StatusType.STATUS)) {
                Status status = (Status) abstractStatus;
                internalShareStatus(currentEmail, status);
            } else if (abstractStatus.getType().equals(StatusType.SHARE)) {
                Share currentShare = (Share) abstractStatus;
                // We share the original status
                Status originalStatus = (Status) statusRepository.findStatusById(currentShare.getOriginalStatusId());
                internalShareStatus(currentEmail, originalStatus);
            } else {
                log.warn("Cannot share this type of status: " + abstractStatus);
            }
        } else {
            log.debug("Cannot share this status, as it does not exist: {}", abstractStatus);
        }
    }

    private void internalShareStatus(String currentEmail, Status status) {
        // create share
        Share share = statusRepository.createShare(currentEmail, status.getDomain(), status.getStatusId().toString());

        // add status to the user's userline and timeline
        userlineRepository.shareStatusToUserline(currentEmail, share);
        shareStatusToTimelineAndNotify(currentEmail, currentEmail, share);
        // add status to the follower's timelines
        Collection<String> followersForUser = followerRepository.findFollowersForUser(currentEmail);
        for (String followerEmail : followersForUser) {
            shareStatusToTimelineAndNotify(currentEmail, followerEmail, share);
        }
        // update the status details to add this share
        sharesRepository.newShareByEmail(status.getStatusId().toString(), currentEmail);
        // mention the status' author that the user has shared his status
        MentionShare mentionShare = statusRepository.createMentionShare(currentEmail, status.getStatusId().toString());
        mentionlineRepository.addStatusToMentionline(status.getEmail(), mentionShare.getStatusId().toString());
    }

    public void addFavoriteStatus(String statusId) {
        log.debug("Favorite status : {}", statusId);
        AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
        if (abstractStatus.getType().equals(StatusType.STATUS)) {
            favoritelineRepository.addStatusToFavoriteline(SecurityUtils.getCurrentUserEmail(), statusId);
        } else {
            log.warn("Cannot favorite this type of status: " + abstractStatus);
        }
    }

    public void removeFavoriteStatus(String statusId) {
        log.debug("Un-favorite status : {}", statusId);
        AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
        if (abstractStatus.getType().equals(StatusType.STATUS)) {
            String userEmail = SecurityUtils.getCurrentUserEmail();
            favoritelineRepository.removeStatusFromFavoriteline(userEmail, statusId);
        } else {
            log.warn("Cannot un-favorite this type of status: " + abstractStatus);
        }
    }

    public void announceStatus(String statusId) {
        log.debug("Announce status : {}", statusId);
        String currentEmail = SecurityUtils.getCurrentUserEmail();
        AbstractStatus abstractStatus = statusRepository.findStatusById(statusId);
        if (abstractStatus != null) {
            if (abstractStatus.getType().equals(StatusType.STATUS)) {
                Status status = (Status) abstractStatus;
                internalAnnounceStatus(currentEmail, status);
            } else if (abstractStatus.getType().equals(StatusType.SHARE)) {
                Share currentShare = (Share) abstractStatus;
                // We announce the original status
                Status originalStatus = (Status) statusRepository.findStatusById(currentShare.getOriginalStatusId());
                internalAnnounceStatus(currentEmail, originalStatus);
            } else {
                log.warn("Cannot announce this type of status: " + abstractStatus);
            }
        } else {
            log.debug("Cannot announce this status, as it does not exist: {}", abstractStatus);
        }
    }

    private void internalAnnounceStatus(String currentEmail, Status status) {
        // create announcement
        Announcement announcement = statusRepository.createAnnouncement(currentEmail, status.getDomain(), status.getStatusId().toString());

        // add status to everyone's timeline
        String domain = status.getDomain();
        log.info("Announcing to domain: " + domain);
        List<String> emails = domainRepository.getEmailsInDomain(domain);
        timelineRepository.announceStatusToTimeline(currentEmail, emails, announcement);
//        for (String username : usernames) {
//            atmosphereService.notifyUser(username, announcement);
//        }
    }

    /**
     * The favline contains the user's favorites status
     *
     * @return a status list
     */
    public Collection<StatusDTO> getFavoritesline() {
        String currentEmail = SecurityUtils.getCurrentUserEmail();
        List<String> statuses = favoritelineRepository.getFavoriteline(currentEmail);
        Collection<StatusDTO> dtos = buildStatusList(statuses);
        if (statuses.size() != dtos.size()) {
            Collection<String> statusIdsToDelete = findStatusesToCleanUp(statuses, dtos);
            for (String statusId : statusIdsToDelete) {
                favoritelineRepository.removeStatusFromFavoriteline(currentEmail, statusId);
            }
            return getFavoritesline();
        }
        dtos = removeStatusFromBlockedUsers(dtos);
        return dtos;
    }

    /**
     * Adds the status to the timeline and notifies the user with Atmosphere.
     */
    private void shareStatusToTimelineAndNotify(String sharedByEmail, String timelineEmail, Share share) {
        timelineRepository.shareStatusToTimeline(sharedByEmail, timelineEmail, share);
//        atmosphereService.notifyUser(timelineUsername, share);
    }

    private Collection<StatusDTO> removeStatusFromBlockedUsers(Collection<StatusDTO> dtos) {
        String currentEmail = SecurityUtils.getCurrentUserEmail();
        String domain = DomainUtil.getDomainFromEmail(currentEmail);
        Collection<String> blockedUsers = blockService.getUsersBlockedEmailForUser(currentEmail);
        Collection<StatusDTO> newDtos = new ArrayList<>();
        for (StatusDTO dto : dtos) {
            if (!blockedUsers.contains(DomainUtil.getEmailFromUsernameAndDomain(dto.getUsername(), domain))) {
                newDtos.add(dto);
            }
        }
        return newDtos;
    }
}
