package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.AttachmentRepository;
import fr.ippon.tatami.repository.UserAttachmentRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.AuthenticationService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import java.util.Collection;

@Service
public class AttachmentService {

    private static final Log log = LogFactory.getLog(AttachmentService.class);

    @Inject
    private AttachmentRepository attachmentRepository;

    @Inject
    private UserAttachmentRepository userAttachmentRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private AuthenticationService authenticationService;

    public String createAttachment(Attachment attachment) {
        attachmentRepository.createAttachment(attachment);
        String attachmentId = attachment.getAttachmentId();
        userAttachmentRepository.addAttachementId(authenticationService.getCurrentUser().getLogin(),
                attachmentId);

        User currentUser = authenticationService.getCurrentUser();
        currentUser.setAttachementsSize(currentUser.getAttachementsSize() + attachment.getSize());
        try {
            userRepository.updateUser(currentUser);
        } catch (ConstraintViolationException cve) {
            log.info("Constraint violated while updating user " + currentUser + " : " + cve);
            throw cve;
        }

        return attachmentId;
    }

    public Attachment getAttachementById(String attachmentId) {
        return attachmentRepository.findAttachmentById(attachmentId);
    }

    public Collection<String> getAttachmentIdsForCurrentUser(int pagination) {
        Collection<String> attachmentIds =
                userAttachmentRepository.
                        findAttachementIds(authenticationService.getCurrentUser().getLogin(),
                                pagination);

        return attachmentIds;
    }

    public void deleteAttachment(Attachment attachment){
        if (log.isDebugEnabled()) {
            log.debug("Removing attachment : " + attachment);
        }
        User currentUser = authenticationService.getCurrentUser();

        boolean fileAlreadyDeleted = false;
        for(String file : userAttachmentRepository.findAttachementIds(currentUser.getLogin(), 0)){
            if (file.equals(attachment.getAttachmentId())) {
                fileAlreadyDeleted = true;
            }
        }

        if(fileAlreadyDeleted){
            userAttachmentRepository.removeAttachementId(currentUser.getLogin(), attachment.getAttachmentId());
            attachmentRepository.deleteAttachment(attachment);
        }

    }


}
