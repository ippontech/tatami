package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.domain.DomainConfiguration;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.AttachmentRepository;
import fr.ippon.tatami.repository.DomainConfigurationRepository;
import fr.ippon.tatami.repository.UserAttachmentRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.exception.StorageSizeException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;


@Service
public class AttachmentService {

    private static final Log log = LogFactory.getLog(AttachmentService.class);

    @Inject
    private AttachmentRepository attachmentRepository;

    @Inject
    private UserAttachmentRepository userAttachmentRepository;

    @Inject
    private DomainConfigurationRepository domainConfigurationRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private AuthenticationService authenticationService;

    public String createAttachment(Attachment attachment) throws StorageSizeException {

        User currentUser = authenticationService.getCurrentUser();
        DomainConfiguration domainConfiguration =
                domainConfigurationRepository.findDomainConfigurationByDomain(currentUser.getDomain());

        long newAttachmentsSize = currentUser.getAttachmentsSize() + attachment.getSize();
        if (newAttachmentsSize > domainConfiguration.getStorageSizeAsLong()) {
            log.info("User " + currentUser.getLogin() +
                    " has tried to exceed his storage capacity. current storage=" +
                    currentUser.getAttachmentsSize() +
                    ", storage capacity=" +
                    domainConfiguration.getStorageSizeAsLong());

            throw new StorageSizeException("User storage exceeded for user " + currentUser.getLogin());
        }
        attachmentRepository.createAttachment(attachment);
        userAttachmentRepository.addAttachmentId(authenticationService.getCurrentUser().getLogin(),
                attachment.getAttachmentId());

        // Refresh user data, to reduce the risk of errors
        currentUser = authenticationService.getCurrentUser();
        currentUser.setAttachmentsSize(currentUser.getAttachmentsSize() + attachment.getSize());
        userRepository.updateUser(currentUser);
        return attachment.getAttachmentId();
    }

    public Attachment getAttachmentById(String attachmentId) {
        return attachmentRepository.findAttachmentById(attachmentId);
    }

    public Collection<String> getAttachmentIdsForCurrentUser(int pagination) {
        Collection<String> attachmentIds =
                userAttachmentRepository.
                        findAttachmentIds(authenticationService.getCurrentUser().getLogin());

        if (log.isDebugEnabled()) {
            log.debug("Collection of attachments : " + attachmentIds.size());
        }

        return attachmentIds;
    }

    public void deleteAttachment(Attachment attachment) {
        if (log.isDebugEnabled()) {
            log.debug("Removing attachment : " + attachment);
        }
        User currentUser = authenticationService.getCurrentUser();

        for (String attachmentIdTest : userAttachmentRepository.findAttachmentIds(currentUser.getLogin())) {
            if (attachmentIdTest.equals(attachment.getAttachmentId())) {
                userAttachmentRepository.removeAttachmentId(currentUser.getLogin(), attachment.getAttachmentId());
                attachmentRepository.deleteAttachment(attachment);
                long newAttachmentsSize = currentUser.getAttachmentsSize() - attachment.getSize();
                currentUser.setAttachmentsSize(newAttachmentsSize);
                userRepository.updateUser(currentUser);
                break;
            }
        }
    }

    public Collection<Long> getDomainQuota() {
        User currentUser = authenticationService.getCurrentUser();
        DomainConfiguration domainConfiguration =
                domainConfigurationRepository.findDomainConfigurationByDomain(currentUser.getDomain());

        Long domainQuota = domainConfiguration.getStorageSizeAsLong();
        Long userQuota = currentUser.getAttachmentsSize();

        Long quota = (userQuota * 100) / domainQuota;

        Collection<Long> taux = new ArrayList<Long>();
        taux.add(quota);

        if (log.isDebugEnabled()) {
            log.debug("Domain quota attachments : " + quota);
        }

        return taux;
    }
}
