package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Avatar;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.AvatarRepository;
import fr.ippon.tatami.repository.DomainConfigurationRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.AuthenticationService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.inject.Inject;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class AvatarService {

    private static final Log log = LogFactory.getLog(AvatarService.class);

    @Inject
    private AvatarRepository avatarRepository;

    @Inject
    private DomainConfigurationRepository domainConfigurationRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private AuthenticationService authenticationService;

    public String createAvatar(Avatar avatar){

        User currentUser = authenticationService.getCurrentUser();

        if(!currentUser.getAvatar().isEmpty()){
            deleteAvatar(currentUser.getAvatar());
        }

        try{
            avatar.setContent(scaleImage(avatar.getContent()));
        }catch (IOException e){
            log.info("Avatar could not be resized : " + e.getMessage());
            return null;
        }

        avatarRepository.createAvatar(avatar);

        if (log.isDebugEnabled()) {
            log.debug("Avatar created : " + avatar);
        }

        return avatar.getAvatarId();
    }

    public Avatar getAvatarById(String avatartId) {
        if (log.isDebugEnabled()) {
            log.debug("Get Avatar Id : " + avatartId);
        }
        return avatarRepository.findAvatarById(avatartId);
    }

    public void deleteAvatar(String avatarId){
        avatarRepository.removeAvatar(avatarId);

        User currentUser = authenticationService.getCurrentUser();
        userRepository.updateUser(currentUser);
    }
    /*
    * TO DO : add param ratio to scale an image in 4/3 or 16/9
    */
    public byte[] scaleImage(byte[] data) throws IOException{
        ByteArrayInputStream in = new ByteArrayInputStream(data);

        BufferedImage img = ImageIO.read(in);
        int width = 100;
        int height = width * 3 / 4; // ratio 4/3

        Image image = img.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        bufferedImage.getGraphics().drawImage(image, 0, 0, new Color(0,0,0), null);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "jpg", byteArrayOutputStream);

        if (log.isDebugEnabled()) {
            log.info("New Byte size of Avatar : " + byteArrayOutputStream.size() / 1024 + " Kbits");
        }

        return byteArrayOutputStream.toByteArray();
    }
}
