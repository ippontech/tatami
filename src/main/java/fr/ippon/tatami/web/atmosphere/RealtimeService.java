package fr.ippon.tatami.web.atmosphere;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.atmosphere.config.service.ManagedService;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResponse;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.handler.OnMessage;

import java.io.IOException;

@ManagedService(
        path = "/realtime/statuses/home_timeline")
public class RealtimeService extends OnMessage<TatamiNotification> {

    private static final Log log = LogFactory.getLog(RealtimeService.class);

    private static final ObjectMapper jsonObjectMapper = new ObjectMapper();

    @Override
    public void onOpen(AtmosphereResource resource) throws IOException {
        log.debug("Opening Atmosphere connection");

        String broadcasterName = "/realtime/statuses/home_timeline/" +
                resource.getRequest().getRemoteUser();

        if (log.isDebugEnabled()) {
            log.debug("Subscribing this resource to broadcaster: " + broadcasterName);
        }
        Broadcaster b =
                BroadcasterFactory.getDefault().lookup(broadcasterName, true);

        b.addAtmosphereResource(resource);
    }

    @Override
    public void onResume(AtmosphereResponse response) throws IOException {
        log.debug("Resuming Atmosphere connection");
    }

    @Override
    public void onTimeout(AtmosphereResponse response) throws IOException {
        log.debug("Atmosphere connection timeout");
    }

    @Override
    public void onDisconnect(AtmosphereResponse response) throws IOException {
        log.debug("Closing Atmosphere connection");
    }

    @Override
    public void onMessage(AtmosphereResponse response, TatamiNotification notification) throws IOException {
        if (log.isDebugEnabled()) {
            log.debug("Received Atmosphere message: " + notification);
        }
        String json = jsonObjectMapper.writeValueAsString(notification);
        response.getWriter().write(json);
    }
}
