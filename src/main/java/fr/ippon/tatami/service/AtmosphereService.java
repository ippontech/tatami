package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.status.AbstractStatus;
import fr.ippon.tatami.web.rest.dto.StatusDTO;
import fr.ippon.tatami.web.atmosphere.TatamiNotification;
//import org.atmosphere.cpr.Broadcaster;
//import org.atmosphere.cpr.BroadcasterFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

@Service
public class AtmosphereService {

    private static final Logger log = LoggerFactory.getLogger(AtmosphereService.class);

    @Inject
    private TimelineService timelineService;

    /**
     * Notifies the user with Atmosphere.
     */
    public void notifyUser(String login, AbstractStatus abstractStatus) {
        log.debug("Notifying user: {}", login);
        StatusDTO statusDTO = timelineService.getStatus(abstractStatus.getStatusId().toString());
        TatamiNotification notification = new TatamiNotification();
        notification.setLogin(login);
        notification.setStatusDTO(statusDTO);
        // Atmosphere is not yet implemented in this project. Commenting this out for now
//        try {
//            Broadcaster broadcaster =
//                    BroadcasterFactory
//                            .getDefault()
//                            .lookup("/realtime/statuses/home_timeline/" + login, true);
//
//            if (broadcaster != null) {
//                broadcaster.broadcast(notification);
//            } else {
//                log.info("Notification error, the broadcaster is null");
//            }
        try {
        // do nothing
        } catch (Exception e) {
            log.warn("Notification error: " + e.getMessage());
        }
    }
}
