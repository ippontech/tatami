package fr.ippon.tatami.service;

import com.notnoop.apns.APNS;
import com.notnoop.apns.ApnsService;
import com.notnoop.exceptions.NetworkIOException;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.repository.AppleDeviceRepository;
import fr.ippon.tatami.repository.AppleDeviceUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Collection;
import java.util.Date;
import java.util.Map;

/**
 * Notifies users with iOS push notifications.
 */
@Service
@Profile("apple-push")
public class ApplePushService {

    private static final Logger log = LoggerFactory.getLogger(ApplePushService.class);

    private ApnsService apnsService;

    @Inject
    private Environment env;

    @Inject
    private AppleDeviceRepository appleDeviceRepository;

    @Inject
    private AppleDeviceUserRepository appleDeviceUserRepository;

    @PostConstruct
    public void init() {
        log.info("Creating Apple Push Service");
        String certificate = env.getRequiredProperty("apple.push.certificate");
        String password = env.getRequiredProperty("apple.push.password");
        apnsService =
                APNS.newService()
                        .withCert(certificate, password)
                        .withSandboxDestination()
                        .build();

        try {
            apnsService.testConnection();
            log.info("Apple Push Service is OK");
        } catch (NetworkIOException nioe) {
            log.warn("Apple Push Service is NOT OK");
        }
    }

    /**
     * Notifies the user with APNS.
     */
    public void notifyUser(String login, Status status) {
        log.debug("Notifying user with Apple Push: {}", login);
        try {
            String message =
                    "@" +
                            status.getUsername() +
                            "\n" +
                            status.getContent();

            if (message.length() > 256) {
                message = message.substring(0, 252) + "...";
            }

            String payload =
                    APNS.newPayload()
                            .alertBody(message).build();

            Collection<String> deviceIds = appleDeviceRepository.findAppleDevices(login);
            for (String deviceId : deviceIds) {
                log.debug("Notifying user : {} - device : {}", login, deviceId);
                apnsService.push(deviceId, payload);
            }

        } catch (Exception e) {
            log.warn("Apple Push error: " + e.getMessage());
        }
    }

    /**
     * Check Apple feedback service for inactive devices.
     */
    @Scheduled(cron = "0 0 23 * * ?")
    public void feedbackService() {
        log.info("Checking the Apple Feedback Service for inactive devices");
        try {
            Map<String, Date> inactiveDevices = apnsService.getInactiveDevices();
            for (String deviceId : inactiveDevices.keySet()) {
                log.debug("Device {} is inactive", deviceId);
                String login = appleDeviceUserRepository.findLoginForDeviceId(deviceId);
                log.debug("Removing device for user {}" + login);
                appleDeviceRepository.removeAppleDevice(login, deviceId);
                appleDeviceUserRepository.removeAppleDeviceForUser(deviceId);
            }
        } catch (Exception e) {
            log.warn("Apple Feedback Service error: " + e.getMessage());
        }
    }
}
