package fr.ippon.tatami.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import javax.imageio.ImageIO;
import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.domain.DomainConfiguration;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.AttachmentRepository;
import fr.ippon.tatami.repository.DomainConfigurationRepository;
import fr.ippon.tatami.repository.UserAttachmentRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.exception.StorageSizeException;


@Service
public class AttachmentService {

    private static final Logger log = LoggerFactory.getLogger(AttachmentService.class);

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
    
    @Inject
    private Environment env;

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
        
        attachment.setThumbnail(computeThumbnail(attachment));
        
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
        Attachment attachment =  attachmentRepository.findAttachmentById(attachmentId);
        //Computing the thumbnail if it does not exists
        if(! attachment.getHasThumbnail()) {
        	attachment.setThumbnail(computeThumbnail(attachment));
        	attachmentRepository.updateThumbnail(attachment);
        }
        return attachment;
    }

    public Collection<String> getAttachmentIdsForCurrentUser(int pagination, String finish) {
        Collection<String> attachmentIds =
                userAttachmentRepository.
                        findAttachmentIds(authenticationService.getCurrentUser().getLogin(), pagination,finish);

        log.debug("Collection of attachments : {}", attachmentIds.size());

        return attachmentIds;
    }

    public void deleteAttachment(Attachment attachment) {
        log.debug("Removing attachment : {}", attachment);
        User currentUser = authenticationService.getCurrentUser();

        for (String attachmentIdTest : userAttachmentRepository.findAttachmentIds(currentUser.getLogin())) {
            if (attachmentIdTest.equals(attachment.getAttachmentId())) {
                userAttachmentRepository.removeAttachmentId(currentUser.getLogin(), attachment.getAttachmentId());
                attachmentRepository.deleteAttachment(attachment);
                // Refresh user data, to reduce the risk of errors
                currentUser = authenticationService.getCurrentUser();
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

        log.debug("Domain quota attachments : {}", quota);

        return taux;
    }
    
    private byte[] computeThumbnail(Attachment attachment) {
    	byte[] result = new byte[0];
    	
    	String[] imagesExtensions = env.getProperty("tatami.attachment.thumbnail.extensions").split(",");
    	for(String ext : imagesExtensions) {
    		if(attachment.getFilename().endsWith(ext)) {
    			attachment.setHasThumbnail(true);
    			break;
    		}
    	}
    	if(attachment.getHasThumbnail()) {
    		try {
    			BufferedImage thumbnail = new BufferedImage(100, 100, BufferedImage.TYPE_INT_ARGB);
				thumbnail.createGraphics()
						.drawImage(ImageIO
								.read(new ByteArrayInputStream(attachment.getContent()))
    							.getScaledInstance(100, 100, BufferedImage.SCALE_SMOOTH), 0, 0, null);
				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				ImageIO.write(thumbnail, "png", baos);
				baos.flush();
				result = baos.toByteArray();
    		} catch(IOException e) {
    			log.error("Error creating thumbnail for attachment "+attachment.getAttachmentId());
    		}
    	}
    	return result;
    }
}
