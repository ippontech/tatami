package fr.ippon.tatami.service;

import com.notnoop.apns.APNS;
import com.notnoop.apns.ApnsService;
import fr.ippon.tatami.domain.status.AbstractStatus;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
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

    @PostConstruct
    public void init() {
        apnsService =
                APNS.newService()
                        .withCert("/path/to/certificate.p12", "MyCertPassword")
                        .withSandboxDestination()
                        .build();
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
            log.warn("Notification error: " + e.getMessage());
        }
    }

    public void feedbackService() {
        Map<String, Date> inactiveDevices = apnsService.getInactiveDevices();
        for (String deviceToken : inactiveDevices.keySet()) {
            Date inactiveAsOf = inactiveDevices.get(deviceToken);
            log.debug("Device '" + deviceToken + "' is inactive");
        }
    }
}
