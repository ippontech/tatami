package fr.ippon.tatami.web.atmosphere;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.atmosphere.config.service.ManagedService;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResponse;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.handler.OnMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@ManagedService(
        path = "/realtime/statuses/home_timeline")
public class RealtimeService extends OnMessage<TatamiNotification> {

    private static final Logger log = LoggerFactory.getLogger(RealtimeService.class);

    private static final ObjectMapper jsonObjectMapper = new ObjectMapper();

    @Override
    public void onOpen(AtmosphereResource resource) throws IOException {
        log.debug("Opening Atmosphere connection");

        String broadcasterName = "/realtime/statuses/home_timeline/" +
                resource.getRequest().getRemoteUser();

        log.debug("Subscribing this resource to broadcaster: {}", broadcasterName);
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
        log.debug("Received Atmosphere message: {}", notification);
        String json = jsonObjectMapper.writeValueAsString(notification);
        response.getWriter().write(json);
    }
}
