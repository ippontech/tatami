package fr.ippon.tatami.service;

import com.notnoop.apns.APNS;
import com.notnoop.apns.ApnsService;
import com.notnoop.exceptions.NetworkIOException;
import fr.ippon.tatami.domain.status.AbstractStatus;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Date;
import java.util.Map;

/**
 * Notifies users with iOS push notifications.
 */
@Service
@Profile("apple-push")
public class ApplePushService {

    private static final Log log = LogFactory.getLog(ApplePushService.class);

    private ApnsService apnsService;

    @Inject
    private Environment env;

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
    public void notifyUser(String login, AbstractStatus abstractStatus) {
        if (log.isDebugEnabled()) {
            log.debug("Notifying user with Apple Push: " + login);
        }
        try {
            String payload =
                    APNS.newPayload()
                        .badge(3)
                        .alertBody("Hello from Tatami!").build();

            String token = "test token";
            apnsService.push(token, payload);
        } catch (Exception e) {
            log.warn("Apple Push error: " + e.getMessage());
        }
    }

    /**
     * Check Apple feedback service for inactive devices.
     */
    @Scheduled(cron = "0 0 23 * * ?")
    public void feedbackService() {
        log.info("Checking the Apple feedback service for inactive devices");
        Map<String, Date> inactiveDevices = apnsService.getInactiveDevices();
        for (String deviceToken : inactiveDevices.keySet()) {
            Date inactiveAsOf = inactiveDevices.get(deviceToken);
            log.debug("Device '" + deviceToken + "' is inactive");
        }
    }
}
