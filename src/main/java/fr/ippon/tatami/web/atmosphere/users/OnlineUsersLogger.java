package fr.ippon.tatami.web.atmosphere.users;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.util.DomainUtil;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.websocket.WebSocketEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class OnlineUsersLogger implements WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(OnlineUsersLogger.class);

    Map<String, User> onlineUsers;

    private User user;

    private Broadcaster broadcaster;

    public OnlineUsersLogger(Map<String, User> onlineUsers, User user, Broadcaster broadcaster) {
        this.onlineUsers = onlineUsers;
        this.user = user;
        this.broadcaster = broadcaster;
    }

    public void onConnect(WebSocketEvent event) {
        logger.debug("onConnect(): {}", event);
        onlineUsers.put(user.getLogin(), user);
        broadcaster.broadcast(generateUserList());
    }

    public void onDisconnect(WebSocketEvent event) {
        logger.debug("onDisconnect(): {}", event);
        onlineUsers.remove(user.getLogin());
        broadcaster.broadcast(generateUserList());
    }

    public void onSuspend(final AtmosphereResourceEvent event) {
    }

    public void onResume(AtmosphereResourceEvent event) {
    }

    public void onDisconnect(AtmosphereResourceEvent event) {
    }

    public void onBroadcast(AtmosphereResourceEvent event) {
    }

    public void onThrowable(AtmosphereResourceEvent event) {
    }

    public void onHandshake(WebSocketEvent event) {
    }

    public void onMessage(WebSocketEvent event) {
    }

    public void onClose(WebSocketEvent event) {
    }

    public void onControl(WebSocketEvent event) {
    }

    private String generateUserList() {
        String result = "";
        String domain = DomainUtil.getDomainFromLogin(user.getLogin());
        for (User onlineUser : onlineUsers.values()) {
            if (domain.equals(onlineUser.getDomain())) {
                result += onlineUser.getUsername() + ";";
            }
        }
        return result;
    }
}
