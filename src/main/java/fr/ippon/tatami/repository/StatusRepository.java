package fr.ippon.tatami.repository;

import com.datastax.driver.core.*;
import com.datastax.driver.core.querybuilder.Insert;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.utils.UUIDs;
import com.datastax.driver.mapping.Mapper;
import com.datastax.driver.mapping.MappingManager;
import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;
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
public class StatusRepository {

    private final Logger log = LoggerFactory.getLogger(StatusRepository.class);

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

    @Inject
    private DiscussionRepository discussionRepository;

    @Inject
    private SharesRepository sharesRepository;

    @Inject
    private StatusAttachmentRepository statusAttachmentRepository;

    @Inject
    private AttachmentRepository attachmentRepository;

    private PreparedStatement findOneByIdStmt;


    private PreparedStatement deleteByIdStmt;


    @Inject
    private UserRepository userRepository;

    @Inject
    Session session;

    private Mapper<Status> mapper;

    @PostConstruct
    public void init() {
        mapper = new MappingManager(session).mapper(Status.class);
        findOneByIdStmt = session.prepare(
                "SELECT * " +
                        "FROM status " +
                        "WHERE statusId = :statusId");
        deleteByIdStmt = session.prepare("DELETE FROM status " +
                "WHERE statusId = :statusId");
    }



    public Status createStatus(String login,
                               String username,
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
        status.setStatusId(UUIDs.timeBased());
        status.setLogin(login);
        status.setType(StatusType.STATUS);
        status.setUsername(username);
        String domain = DomainUtil.getDomainFromLogin(login);
        status.setDomain(domain);
        status.setStatusPrivate(statusPrivate);

        status.setContent(content);

        Set<ConstraintViolation<Status>> constraintViolations = validator.validate(status);
        if (!constraintViolations.isEmpty()) {
            if (log.isDebugEnabled()) {
                constraintViolations.forEach(e -> log.debug("Constraint violation: {}", e.getMessage()));
            }
            throw new ConstraintViolationException(new HashSet<>(constraintViolations));
        }
        if (group != null) {
            UUID groupId = group.getGroupId();
            status.setGroupId(groupId.toString());
        }

        if (attachmentIds != null && attachmentIds.size() > 0) {
            status.setHasAttachments(true);
        }

        if (discussionId != null) {
            status.setDiscussionId(discussionId);
        }

        if (replyTo != null) {
            status.setReplyTo(replyTo);
        }

        if (replyToUsername != null) {
            status.setReplyToUsername(replyToUsername);
        }
        if(geoLocalization!=null) {
            status.setGeoLocalization(geoLocalization);
        }
        status.setStatusDate(new Date());
        BatchStatement batch = new BatchStatement();
        batch.add(mapper.saveQuery(status));
        session.execute(batch);

        return status;
    }


    public Share createShare(String login, String originalStatusId) {
        Share share = new Share();
        share.setLogin(login);
        share.setType(StatusType.SHARE);
        String username = DomainUtil.getUsernameFromLogin(login);
        share.setUsername(username);
        String domain = DomainUtil.getDomainFromLogin(login);
        share.setDomain(domain);

        Insert inserter = this.createBaseStatus(share);
        share.setOriginalStatusId(originalStatusId);
        inserter = inserter.value("originalStatusId",UUID.fromString(originalStatusId));
        log.debug("Persisting Share : {}", share);
        session.execute(inserter);
        return share;
    }

    private Insert createBaseStatus(AbstractStatus abstractStatus) {

        abstractStatus.setStatusId(UUIDs.timeBased());
        abstractStatus.setStatusDate(Calendar.getInstance().getTime());
        if (abstractStatus.getLogin() == null) {
            throw new IllegalStateException("Login cannot be null for status: " + abstractStatus);
        }
        if (abstractStatus.getUsername() == null) {
            throw new IllegalStateException("Username cannot be null for status: " + abstractStatus);
        }
        if (abstractStatus.getDomain() == null) {
            throw new IllegalStateException("Domain cannot be null for status: " + abstractStatus);
        }

        return QueryBuilder.insertInto("status")
                .value("statusId",abstractStatus.getStatusId())
                .value("statusDate",abstractStatus.getStatusDate())
                .value("login", abstractStatus.getLogin())
                .value("username",abstractStatus.getUsername())
                .value("domain",abstractStatus.getDomain())
                .value("type",abstractStatus.getType().name());
    }


    public Announcement createAnnouncement(String login, String originalStatusId) {
        Announcement announcement = new Announcement();
        announcement.setLogin(login);
        announcement.setType(StatusType.ANNOUNCEMENT);
        User user = userRepository.findOneByLogin(login).get();
        //String username = DomainUtil.getUsernameFromLogin(login);
        String username = user.getUsername();
        announcement.setUsername(username);
        //String domain = DomainUtil.getDomainFromLogin(login);
        String domain = user.getDomain();
        announcement.setDomain(domain);

        Insert inserter = this.createBaseStatus(announcement);
        announcement.setOriginalStatusId(originalStatusId);
        inserter = inserter.value("originalStatusId",UUID.fromString(originalStatusId));
        log.debug("Persisting Announcement : {}", announcement);
        session.execute(inserter);
        return announcement;
    }


    public MentionFriend createMentionFriend(String login, String followerLogin) {
        MentionFriend mentionFriend = new MentionFriend();
        mentionFriend.setLogin(login);
        mentionFriend.setType(StatusType.MENTION_FRIEND);
        String username = DomainUtil.getUsernameFromLogin(login);
        mentionFriend.setUsername(username);
        String domain = DomainUtil.getDomainFromLogin(login);
        mentionFriend.setDomain(domain);

        Insert inserter = this.createBaseStatus(mentionFriend);
        mentionFriend.setFollowerLogin(followerLogin);
        inserter = inserter.value("followerLogin",followerLogin);
        log.debug("Persisting Announcement : {}", mentionFriend);
        session.execute(inserter);
        return mentionFriend;
    }


    public MentionShare createMentionShare(String login, String originalStatusId) {
        MentionShare mentionShare = new MentionShare();
        mentionShare.setLogin(login);
        mentionShare.setType(StatusType.MENTION_SHARE);
        String username = DomainUtil.getUsernameFromLogin(login);
        mentionShare.setUsername(username);
        String domain = DomainUtil.getDomainFromLogin(login);
        mentionShare.setDomain(domain);

        Insert inserter = this.createBaseStatus(mentionShare);
        mentionShare.setOriginalStatusId(originalStatusId);
        inserter = inserter.value("originalStatusId",UUID.fromString(originalStatusId));
        log.debug("Persisting Announcement : {}", mentionShare);
        session.execute(inserter);

        return mentionShare;
    }


    @Cacheable("status-cache")
    public AbstractStatus findStatusById(String statusId) {
        if (statusId == null || statusId.equals("")) {
            return null;
        }
        if (log.isTraceEnabled()) {
            log.trace("Finding status : " + statusId);
        }
        BoundStatement stmt = findOneByIdStmt.bind();
        stmt.setUUID("statusId", UUID.fromString(statusId));
        ResultSet rs = session.execute(stmt);
        if (rs.isExhausted()) {
            return null;
        }
        Row row = rs.one();
        AbstractStatus status = null;
        String type = row.getString(TYPE);
        if (type == null || type.equals(StatusType.STATUS.name())) {
            status = findStatus(row, statusId);
        } else if (type.equals(StatusType.SHARE.name())) {
            status = findShare(row);
        } else if (type.equals(StatusType.ANNOUNCEMENT.name())) {
            status = findAnnouncement(row);
        } else if (type.equals(StatusType.MENTION_FRIEND.name())) {
            status = findMentionFriend(row);
        } else if (type.equals(StatusType.MENTION_SHARE.name())) {
            status = findMentionShare(row);
        } else {
            throw new IllegalStateException("Status has an unknown type: " + type);
        }
        if (status == null) { // Status was not found, or was removed
            return null;
        }
        status.setStatusId(UUID.fromString(statusId));
        status.setLogin(row.getString(LOGIN));
        status.setUsername(row.getString(USERNAME));

        String domain = row.getString(DOMAIN);
        if (domain != null) {
            status.setDomain(domain);
        } else {
            throw new IllegalStateException("Status cannot have a null domain: " + status);
        }

        status.setStatusDate(row.getDate(STATUS_DATE));
        Boolean removed = row.getBool(REMOVED);
        if (removed != null) {
            status.setRemoved(removed);
        }
        return status;

    }

    private AbstractStatus findMentionShare(Row result) {
        MentionShare mentionShare = new MentionShare();
        mentionShare.setType(StatusType.MENTION_SHARE);
        mentionShare.setOriginalStatusId(result.getUUID(ORIGINAL_STATUS_ID).toString());
        return mentionShare;
    }

    private AbstractStatus findMentionFriend(Row result) {
        MentionFriend mentionFriend = new MentionFriend();
        mentionFriend.setType(StatusType.MENTION_FRIEND);
        mentionFriend.setFollowerLogin(result.getString(FOLLOWER_LOGIN));
        return mentionFriend;
    }

    private AbstractStatus findAnnouncement(Row result) {
        Announcement announcement = new Announcement();
        announcement.setType(StatusType.ANNOUNCEMENT);
        announcement.setOriginalStatusId(result.getUUID(ORIGINAL_STATUS_ID).toString());
        return announcement;
    }

    private AbstractStatus findShare(Row result) {
        Share share = new Share();
        share.setType(StatusType.SHARE);
        share.setOriginalStatusId(result.getUUID(ORIGINAL_STATUS_ID).toString());
        return share;
    }

    private AbstractStatus findStatus(Row result, String statusId) {
        Status status = new Status();
        status.setStatusId(UUID.fromString(statusId));
        status.setType(StatusType.STATUS);
        status.setContent(result.getString(CONTENT));
        status.setStatusPrivate(result.getBool(STATUS_PRIVATE));
        status.setGroupId(result.getString(GROUP_ID));
        status.setHasAttachments(result.getBool(HAS_ATTACHMENTS));
        status.setDiscussionId(result.getString(DISCUSSION_ID));
        status.setReplyTo(result.getString(REPLY_TO));
        status.setReplyToUsername(result.getString(REPLY_TO_USERNAME));
        status.setGeoLocalization(result.getString(GEO_LOCALIZATION));
        status.setRemoved(result.getBool(REMOVED));
        if (status.isRemoved()) {
            return null;
        }
        status.setDetailsAvailable(computeDetailsAvailable(status));
        if (status.getHasAttachments() != null && status.getHasAttachments()) {
            Collection<String> attachmentIds = statusAttachmentRepository.findAttachmentIds(statusId);
            Collection<Attachment> attachments = new ArrayList<>();
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


    @CacheEvict(value = "status-cache", key = "#status.statusId")
    public void removeStatus(AbstractStatus status) {
        log.debug("Removing Status : {}", status);
        BatchStatement batch = new BatchStatement();
        batch.add(deleteByIdStmt.bind().setUUID("statusId", status.getStatusId()));
        session.execute(batch);
    }

    private boolean computeDetailsAvailable(Status status) {
        boolean detailsAvailable = false;
        if (status.getType().equals(StatusType.STATUS)) {
            if (StringUtils.isNotBlank(status.getReplyTo())) {
                detailsAvailable = true;
//            } else if (discussionRepository.hasReply(status.getStatusId())) {
//                detailsAvailable = true;
//            } else if (sharesRepository.hasBeenShared(status.getStatusId())) {
//                detailsAvailable = true;
            }
        }
        return detailsAvailable;
    }
}
