package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.status.AbstractStatus;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.service.dto.StatusDTO;
import fr.ippon.tatami.web.atmosphere.TatamiNotification;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

@Service
public class NotificationService {

    private static final Log log = LogFactory.getLog(NotificationService.class);

    @Inject
    private TimelineService timelineService;

    /**
     * Notifies the user with Atmosphere.
     */
    public void notifyUser(String login, AbstractStatus abstractStatus) {
        if (log.isDebugEnabled()) {
            log.debug("Notifying user: " + login);
        }
        StatusDTO statusDTO = timelineService.getStatus(abstractStatus.getStatusId());
        TatamiNotification notification = new TatamiNotification();
        notification.setLogin(login);
        notification.setStatusDTO(statusDTO);
        try {
            Broadcaster broadcaster =
                    BroadcasterFactory
                            .getDefault()
                            .lookup("/realtime/statuses/home_timeline/" + login, true);

            if (broadcaster != null) {
                broadcaster.broadcast(notification);
            } else {
                log.info("Notification error, the broadcaster is null");
            }
        } catch (Exception e) {
            log.warn("Notification error: " + e.getMessage());
        }
    }
}
