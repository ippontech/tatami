package fr.ippon.tatami.service;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.Avatar;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.AvatarRepository;
import fr.ippon.tatami.repository.DomainConfigurationRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.AuthenticationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(AvatarService.class);

    @Inject
    private AvatarRepository avatarRepository;

    @Inject
    private DomainConfigurationRepository domainConfigurationRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private AuthenticationService authenticationService;

    public String createAvatar(Avatar avatar) {

        User currentUser = authenticationService.getCurrentUser();

        if (currentUser.getAvatar() != null && !("").equals(currentUser.getAvatar())) {
            deleteAvatar(currentUser.getAvatar());
        }

        try {
            avatar.setContent(scaleImage(avatar.getContent()));
        } catch (IOException e) {
            log.info("Avatar could not be resized : " + e.getMessage());
            return null;
        }

        avatarRepository.createAvatar(avatar);

        log.debug("Avatar created : {}", avatar);

        return avatar.getAvatarId();
    }

    public Avatar getAvatarById(String avatartId) {
        log.debug("Get Avatar Id : {}", avatartId);
        return avatarRepository.findAvatarById(avatartId);
    }

    public void deleteAvatar(String avatarId) {
        avatarRepository.removeAvatar(avatarId);

        User currentUser = authenticationService.getCurrentUser();
        userRepository.updateUser(currentUser);
    }

    private byte[] scaleImage(byte[] data) throws IOException {
        ByteArrayInputStream in = new ByteArrayInputStream(data);

        BufferedImage img = ImageIO.read(in);
        int width = Constants.AVATAR_SIZE;
        int height = Constants.AVATAR_SIZE;

        Image image = img.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        bufferedImage.getGraphics().drawImage(image, 0, 0, new Color(0, 0, 0), null);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "jpg", byteArrayOutputStream);

        log.debug("New Byte size of Avatar : {} Kbits", byteArrayOutputStream.size() / 1024);

        return byteArrayOutputStream.toByteArray();
    }
}
