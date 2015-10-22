package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.service.util.DomainUtil;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ColumnFamilyUpdater;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.cassandra.utils.TimeUUIDUtils;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.domain.status.*;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.validation.*;
import java.util.*;

/**
 * Cassandra implementation of the status repository.
 * <p/>
 * Timeline and Userline have the same structure :
 * - Key : login
 * - Name : status Id
 * - Value : ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraStatusRepository implements StatusRepository {

    private final Logger log = LoggerFactory.getLogger(CassandraStatusRepository.class);

    private static final String LOGIN = "login";
    private static final String TYPE = "type";
    private static final String USERNAME = "username";
    private static final String DOMAIN = "domain";
    private static final String STATUS_DATE = "statusDate";

    //Normal status
    private static final String STATUS_PRIVATE = "statusPrivate";
    private static final String GROUP_ID = "groupId";
    private static final String HAS_ATTACHMENTS = "hasAttachments";
    private static final String CONTENT = "content";
    private static final String DISCUSSION_ID = "discussionId";
    private static final String REPLY_TO = "replyTo";
    private static final String REPLY_TO_USERNAME = "replyToUsername";
    private static final String REMOVED = "removed";
    private static final String GEO_LOCALIZATION = "geoLocalization";

    //Share, Mention Share & Announcement
    private static final String ORIGINAL_STATUS_ID = "originalStatusId";

    //Mention Friend
    private static final String FOLLOWER_LOGIN = "followerLogin";

    //Bean validation
    private static final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static final Validator validator = factory.getValidator();

    //Cassandra Template
    ColumnFamilyTemplate<String, String> template;

    @Inject
    private Keyspace keyspaceOperator;

    @Inject
    private DiscussionRepository discussionRepository;

    @Inject
    private SharesRepository sharesRepository;

    @Inject
    private StatusAttachmentRepository statusAttachmentRepository;

    @Inject
    private AttachmentRepository attachmentRepository;


    @PostConstruct
    public void init() {
        template =
                new ThriftColumnFamilyTemplate<String, String>(
                        keyspaceOperator,
                        ColumnFamilyKeys.STATUS_CF,
                        StringSerializer.get(),
                        StringSerializer.get());
    }


    @Override
    public Status createStatus(String login,
                               boolean statusPrivate,
                               Group group,
                               Collection<String> attachmentIds,
                               String content,
                               String discussionId,
                               String replyTo,
                               String replyToUsername,
                               String geoLocalization)
            throws ConstraintViolationException {

        Status status = new Status();
        status.setLogin(login);
        status.setType(StatusType.STATUS);
        String username = DomainUtil.getUsernameFromLogin(login);
        status.setUsername(username);
        String domain = DomainUtil.getDomainFromLogin(login);
        status.setDomain(domain);

        status.setContent(content);

        Set<ConstraintViolation<Status>> constraintViolations = validator.validate(status);
        if (!constraintViolations.isEmpty()) {
            if (log.isDebugEnabled()) {
                for (ConstraintViolation cv : constraintViolations) {
                    log.debug("Constraint violation: {}", cv.getMessage());
                }
            }
            throw new ConstraintViolationException(new HashSet<ConstraintViolation<?>>(constraintViolations));
        }

        ColumnFamilyUpdater<String, String> updater = this.createBaseStatus(status);

        updater.setString(CONTENT, content);

        status.setStatusPrivate(statusPrivate);
        updater.setBoolean(STATUS_PRIVATE, statusPrivate);

        if (group != null) {
            String groupId = group.getGroupId();
            status.setGroupId(groupId);
            updater.setString(GROUP_ID, groupId);
        }

        if (attachmentIds != null && attachmentIds.size() > 0) {
            status.setHasAttachments(true);
            updater.setBoolean(HAS_ATTACHMENTS, true);
        }

        if (discussionId != null) {
            status.setDiscussionId(discussionId);
            updater.setString(DISCUSSION_ID, discussionId);
        }

        if (replyTo != null) {
            status.setReplyTo(replyTo);
            updater.setString(REPLY_TO, replyTo);
        }

        if (replyToUsername != null) {
            status.setReplyToUsername(replyToUsername);
            updater.setString(REPLY_TO_USERNAME, replyToUsername);
        }
        if(geoLocalization!=null) {
            status.setGeoLocalization(geoLocalization);
            updater.setString(GEO_LOCALIZATION, geoLocalization);
        }

        log.debug("Persisting Status : {}", status);


        template.update(updater);
        return status;
    }

    @Override
    public Share createShare(String login, String originalStatusId) {
        Share share = new Share();
        share.setLogin(login);
        share.setType(StatusType.SHARE);
        String username = DomainUtil.getUsernameFromLogin(login);
        share.setUsername(username);
        String domain = DomainUtil.getDomainFromLogin(login);
        share.setDomain(domain);
        ColumnFamilyUpdater<String, String> updater = this.createBaseStatus(share);

        updater.setString(ORIGINAL_STATUS_ID, originalStatusId);
        share.setOriginalStatusId(originalStatusId);

        log.debug("Persisting Share : {}", share);

        template.update(updater);
        return share;
    }

    @Override
    public Announcement createAnnouncement(String login, String originalStatusId) {
        Announcement announcement = new Announcement();
        announcement.setLogin(login);
        announcement.setType(StatusType.ANNOUNCEMENT);
        String username = DomainUtil.getUsernameFromLogin(login);
        announcement.setUsername(username);
        String domain = DomainUtil.getDomainFromLogin(login);
        announcement.setDomain(domain);
        ColumnFamilyUpdater<String, String> updater = this.createBaseStatus(announcement);

        updater.setString(ORIGINAL_STATUS_ID, originalStatusId);
        announcement.setOriginalStatusId(originalStatusId);

        log.debug("Persisting Announcement : {}", announcement);

        template.update(updater);
        return announcement;
    }

    @Override
    public MentionFriend createMentionFriend(String login, String followerLogin) {
        MentionFriend mentionFriend = new MentionFriend();
        mentionFriend.setLogin(login);
        mentionFriend.setType(StatusType.MENTION_FRIEND);
        String username = DomainUtil.getUsernameFromLogin(login);
        mentionFriend.setUsername(username);
        String domain = DomainUtil.getDomainFromLogin(login);
        mentionFriend.setDomain(domain);
        ColumnFamilyUpdater<String, String> updater = this.createBaseStatus(mentionFriend);

        updater.setString(FOLLOWER_LOGIN, followerLogin);


        log.debug("Persisting MentionFriend : {}", mentionFriend);

        template.update(updater);
        return mentionFriend;
    }

    @Override
    public MentionShare createMentionShare(String login, String originalStatusId) {
        MentionShare mentionShare = new MentionShare();
        mentionShare.setLogin(login);
        mentionShare.setType(StatusType.MENTION_SHARE);
        String username = DomainUtil.getUsernameFromLogin(login);
        mentionShare.setUsername(username);
        String domain = DomainUtil.getDomainFromLogin(login);
        mentionShare.setDomain(domain);
        ColumnFamilyUpdater<String, String> updater = this.createBaseStatus(mentionShare);

        updater.setString(ORIGINAL_STATUS_ID, originalStatusId);
        mentionShare.setOriginalStatusId(originalStatusId);


        log.debug("Persisting MentionShare : {}", mentionShare);

        template.update(updater);
        return mentionShare;
    }

    private ColumnFamilyUpdater<String, String> createBaseStatus(AbstractStatus abstractStatus) {
        // Generate statusId and statusDate for all statuses
        String statusId = TimeUUIDUtils.getUniqueTimeUUIDinMillis().toString();
        abstractStatus.setStatusId(statusId);
        ColumnFamilyUpdater<String, String> updater = template.createUpdater(statusId);

        Date statusDate = Calendar.getInstance().getTime();
        updater.setDate(STATUS_DATE, statusDate);
        abstractStatus.setStatusDate(statusDate);

        // Persist common data : login, username, domain, type
        String login = abstractStatus.getLogin();
        if (login == null) {
            throw new IllegalStateException("Login cannot be null for status: " + abstractStatus);
        }
        updater.setString(LOGIN, login);

        String username = abstractStatus.getUsername();
        if (username == null) {
            throw new IllegalStateException("Username cannot be null for status: " + abstractStatus);
        }
        updater.setString(USERNAME, username);

        String domain = abstractStatus.getDomain();
        if (domain == null) {
            throw new IllegalStateException("Domain cannot be null for status: " + abstractStatus);
        }
        updater.setString(DOMAIN, domain);

        updater.setString(TYPE, abstractStatus.getType().name());

        return updater;
    }


    @Override
    @Cacheable("status-cache")
    public AbstractStatus findStatusById(String statusId) {
        if (statusId == null || statusId.equals("")) {
            return null;
        }
        if (log.isTraceEnabled()) {
            log.trace("Finding status : " + statusId);
        }

        ColumnFamilyResult<String, String> result = template.queryColumns(statusId);

        if (result.hasResults() == false) {
            return null; // No status was found
        }
        AbstractStatus status = null;
        String type = result.getString(TYPE);
        if (type == null || type.equals(StatusType.STATUS.name())) {
            status = findStatus(result, statusId);
        } else if (type.equals(StatusType.SHARE.name())) {
            status = findShare(result);
        } else if (type.equals(StatusType.ANNOUNCEMENT.name())) {
            status = findAnnouncement(result);
        } else if (type.equals(StatusType.MENTION_FRIEND.name())) {
            status = findMentionFriend(result);
        } else if (type.equals(StatusType.MENTION_SHARE.name())) {
            status = findMentionShare(result);
        } else {
            throw new IllegalStateException("Status has an unknown type: " + type);
        }
        if (status == null) { // Status was not found, or was removed
            return null;
        }
        status.setStatusId(statusId);
        status.setLogin(result.getString(LOGIN));
        status.setUsername(result.getString(USERNAME));

        String domain = result.getString(DOMAIN);
        if (domain != null) {
            status.setDomain(domain);
        } else {
            throw new IllegalStateException("Status cannot have a null domain: " + status);
        }

        status.setStatusDate(result.getDate(STATUS_DATE));
        Boolean removed = result.getBoolean(REMOVED);
        if (removed != null) {
            status.setRemoved(removed);
        }
        return status;
    }

    private Status findStatus(ColumnFamilyResult<String, String> result, String statusId) {
        Status status = new Status();
        status.setStatusId(statusId);
        status.setType(StatusType.STATUS);
        status.setContent(result.getString(CONTENT));
        status.setStatusPrivate(result.getBoolean(STATUS_PRIVATE));
        status.setGroupId(result.getString(GROUP_ID));
        status.setHasAttachments(result.getBoolean(HAS_ATTACHMENTS));
        status.setDiscussionId(result.getString(DISCUSSION_ID));
        status.setReplyTo(result.getString(REPLY_TO));
        status.setReplyToUsername(result.getString(REPLY_TO_USERNAME));
        status.setGeoLocalization(result.getString(GEO_LOCALIZATION));
        status.setRemoved(result.getBoolean(REMOVED));
        if (status.getRemoved() == Boolean.TRUE) {
            return null;
        }
        status.setDetailsAvailable(computeDetailsAvailable(status));
        if (status.getHasAttachments() != null && status.getHasAttachments()) {
            Collection<String> attachmentIds = statusAttachmentRepository.findAttachmentIds(statusId);
            Collection<Attachment> attachments = new ArrayList<Attachment>();
            for (String attachmentId : attachmentIds) {
                Attachment attachment = attachmentRepository.findAttachmentMetadataById(attachmentId);
                if (attachment != null) {
                    // We copy everything excepted the attachment content, as we do not want it in the status cache
                    Attachment attachmentCopy = new Attachment();
                    attachmentCopy.setAttachmentId(attachmentId);
                    attachmentCopy.setSize(attachment.getSize());
                    attachmentCopy.setFilename(attachment.getFilename());
                    attachments.add(attachment);
                }
            }
            status.setAttachments(attachments);
        }
        return status;
    }

    private Share findShare(ColumnFamilyResult<String, String> result) {
        Share share = new Share();
        share.setType(StatusType.SHARE);
        share.setOriginalStatusId(result.getString(ORIGINAL_STATUS_ID));
        return share;
    }

    private Announcement findAnnouncement(ColumnFamilyResult<String, String> result) {
        Announcement announcement = new Announcement();
        announcement.setType(StatusType.ANNOUNCEMENT);
        announcement.setOriginalStatusId(result.getString(ORIGINAL_STATUS_ID));
        return announcement;
    }

    private MentionFriend findMentionFriend(ColumnFamilyResult<String, String> result) {
        MentionFriend mentionFriend = new MentionFriend();
        mentionFriend.setType(StatusType.MENTION_FRIEND);
        mentionFriend.setFollowerLogin(result.getString(FOLLOWER_LOGIN));
        return mentionFriend;
    }

    private MentionShare findMentionShare(ColumnFamilyResult<String, String> result) {
        MentionShare mentionShare = new MentionShare();
        mentionShare.setType(StatusType.MENTION_SHARE);
        mentionShare.setOriginalStatusId(result.getString(ORIGINAL_STATUS_ID));
        return mentionShare;
    }

    @Override
    @CacheEvict(value = "status-cache", key = "#status.statusId")
    public void removeStatus(AbstractStatus status) {
        log.debug("Removing Status : {}", status);

        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(status.getStatusId(), ColumnFamilyKeys.STATUS_CF);
        mutator.execute();
    }

    private boolean computeDetailsAvailable(Status status) {
        boolean detailsAvailable = false;
        if (status.getType().equals(StatusType.STATUS)) {
            if (StringUtils.isNotBlank(status.getReplyTo())) {
                detailsAvailable = true;
            } else if (discussionRepository.hasReply(status.getStatusId())) {
                detailsAvailable = true;
            } else if (sharesRepository.hasBeenShared(status.getStatusId())) {
                detailsAvailable = true;
            }
        }
        return detailsAvailable;
    }
}
