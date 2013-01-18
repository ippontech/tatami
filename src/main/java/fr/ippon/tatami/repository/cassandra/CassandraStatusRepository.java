package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.repository.*;
import me.prettyprint.cassandra.utils.TimeUUIDUtils;
import me.prettyprint.hom.EntityManagerImpl;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

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

    private final Log log = LogFactory.getLog(CassandraStatusRepository.class);

    @Inject
    private EntityManagerImpl em;

    @Inject
    private DiscussionRepository discussionRepository;

    @Inject
    private SharesRepository sharesRepository;

    @Inject
    private StatusAttachmentRepository statusAttachmentRepository;

    @Inject
    private AttachmentRepository attachmentRepository;

    private static ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static Validator validator = factory.getValidator();

    @Override
    public Status createStatus(String login,
                               String username,
                               String domain,
                               boolean statusPrivate,
                               Group group,
                               Collection<String> attachmentIds,
                               String content,
                               String discussionId,
                               String replyTo,
                               String replyToUsername)
            throws ConstraintViolationException {

        Status status = new Status();
        status.setStatusId(TimeUUIDUtils.getUniqueTimeUUIDinMillis().toString());
        status.setLogin(login);
        status.setUsername(username);
        status.setDomain(domain);
        status.setStatusPrivate(statusPrivate);
        if (group != null) {
            status.setGroupId(group.getGroupId());
        }
        if (attachmentIds != null && attachmentIds.size() > 0) {
            status.setHasAttachments(true);
        }
        status.setContent(content);
        status.setStatusDate(Calendar.getInstance().getTime());
        status.setDiscussionId(discussionId);
        status.setReplyTo(replyTo);
        status.setReplyToUsername(replyToUsername);
        status.setRemoved(false);
        if (log.isDebugEnabled()) {
            log.debug("Persisting Status : " + status);
        }
        Set<ConstraintViolation<Status>> constraintViolations = validator.validate(status);
        if (!constraintViolations.isEmpty()) {
            throw new ConstraintViolationException(new HashSet<ConstraintViolation<?>>(constraintViolations));
        }
        em.persist(status);
        return status;
    }

    @Override
    @Cacheable("status-cache")
    public Status findStatusById(String statusId) {
        if (statusId == null || statusId.equals("")) {
            return null;
        }
        if (log.isTraceEnabled()) {
            log.trace("Finding status : " + statusId);
        }
        Status status = em.find(Status.class, statusId);
        if (status == null || status.getRemoved() == Boolean.TRUE) {
            return null;
        }
        status.setDetailsAvailable(computeDetailsAvailable(status));
        if (status.getHasAttachments() != null && status.getHasAttachments() == true) {
            Collection<String> attachmentIds = statusAttachmentRepository.findAttachmentIds(statusId);
            Collection<Attachment> attachments = new ArrayList<Attachment>();
            for (String attachmentId : attachmentIds) {
                Attachment attachment = attachmentRepository.findAttachmentMetadataById(attachmentId);
                if (attachment != null) {
                    // We copy everyting excepted the attachment content, as we do not want it in the status cache
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

    @Override
    @CacheEvict(value = "status-cache", key = "#status.statusId")
    public void removeStatus(Status status) {
        status.setRemoved(true);
        if (log.isDebugEnabled()) {
            log.debug("Updating Status : " + status);
        }
        em.persist(status);
    }

    private boolean computeDetailsAvailable(Status status) {
        boolean detailsAvailable = false;
        if (StringUtils.isNotBlank(status.getReplyTo())) {
            detailsAvailable = true;
        } else if (discussionRepository.hasReply(status.getStatusId())) {
            detailsAvailable = true;
        } else if (sharesRepository.hasBeenShared(status.getStatusId())) {
            detailsAvailable = true;
        }
        return detailsAvailable;
    }
}
