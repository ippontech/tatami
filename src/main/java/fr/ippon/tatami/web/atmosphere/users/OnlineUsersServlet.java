package fr.ippon.tatami.web.atmosphere.users;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import org.atmosphere.config.service.MeteorService;
import org.atmosphere.cpr.*;
import org.atmosphere.interceptor.AtmosphereResourceLifecycleInterceptor;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@MeteorService(path = "/realtime/onlineusers",
        interceptors = {
                AtmosphereResourceLifecycleInterceptor.class})
public class OnlineUsersServlet extends HttpServlet {

    private AuthenticationService authenticationService;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        authenticationService =
                WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext())
                        .getBean(AuthenticationService.class);

    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        // Create a Meteor
        Meteor m = Meteor.build(req);

        Broadcaster broadcaster = lookupBroadcaster(req.getPathInfo());

        // Log all events on the console, including WebSocket events.
        User user = authenticationService.getCurrentUser();
        m.addListener(new OnlineUsersLogger(user, broadcaster));

        res.setContentType("text/html;charset=ISO-8859-1");


        m.setBroadcaster(broadcaster);

        String header = req.getHeader(HeaderConfig.X_ATMOSPHERE_TRANSPORT);
        if (header != null && header.equalsIgnoreCase(HeaderConfig.LONG_POLLING_TRANSPORT)) {
            req.setAttribute(ApplicationConfig.RESUME_ON_BROADCAST, Boolean.TRUE);
            m.suspend(-1, false);
        } else {
            m.suspend(-1);
        }
    }

    private Broadcaster lookupBroadcaster(String pathInfo) {
        String[] decodedPath = pathInfo.split("/");
        Broadcaster b = BroadcasterFactory.getDefault().lookup(decodedPath[decodedPath.length - 1], true);
        return b;
    }
}
