package fr.ippon.tatami.service;

import com.notnoop.apns.APNS;
import com.notnoop.apns.ApnsService;
import com.notnoop.exceptions.NetworkIOException;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.repository.AppleDeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class ApplePushService {

    private static final Logger log = LoggerFactory.getLogger(ApplePushService.class);

    private ApnsService apnsService;

    @Inject
    private Environment env;

    @Inject
    private AppleDeviceRepository appleDeviceRepository;

    @PostConstruct
    public void init() {
        if (env.acceptsProfiles("apple-push")) {
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
        } else {
            log.info("Apple Push Service is NOT active");
        }
    }

    /**
     * Notifies the user with APNS.
     */
    public void notifyUser(String login, Status status) {
        if (apnsService == null) {
            log.debug("Apple Push Service is NOT active");
            return;
        }
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

            feedbackService();

        } catch (Exception e) {
            log.warn("Apple Push error: " + e.getMessage());
        }
    }

    /**
     * Check Apple feedback service for inactive devices.
     */
    @Scheduled(cron = "0 0 23 * * ?")
    public void feedbackService() {
        if (apnsService == null) {
            log.debug("Apple Push Service is NOT active");
            return;
        }
        log.info("Checking the Apple feedback service for inactive devices");
        Map<String, Date> inactiveDevices = apnsService.getInactiveDevices();
        for (String deviceToken : inactiveDevices.keySet()) {
            Date inactiveAsOf = inactiveDevices.get(deviceToken);
            log.debug("Device '" + deviceToken + "' is inactive");
        }
    }
}
