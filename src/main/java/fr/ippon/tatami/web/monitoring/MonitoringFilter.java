package fr.ippon.tatami.web.monitoring;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.util.StopWatch;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * @author Julien Dubois
 */

public class MonitoringFilter implements Filter {

    private final Log log = LogFactory.getLog("monitoring");

    private boolean isMonitored = false;

    public void init(FilterConfig config) throws ServletException {
        if (log.isDebugEnabled()) {
            this.isMonitored = true;
        }
    }


    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        if (isMonitored) {
            StopWatch watch = new StopWatch();
            watch.start();
            chain.doFilter(req, resp);
            watch.stop();

            long time = watch.getLastTaskTimeMillis();

            StringBuffer sb = new StringBuffer();
            if (req instanceof HttpServletRequest) {
                HttpServletRequest request = (HttpServletRequest) req;
                int length = request.getRequestURL().length();
                if (length > 60) {
                    sb.append(request.getRequestURL().substring(length - 60, length));
                } else {
                    sb.append(request.getRequestURL());
                }
            }
            sb.append(" | ");
            sb.append(time);
            sb.append(" | ");
            String username;
            Authentication authent = SecurityContextHolder.getContext().getAuthentication();
            if (authent != null) {
                Object principal = authent.getPrincipal();
                if (principal instanceof String) {
                    username = "anonymous";
                } else {
                    User springSecurityUser = (User) principal;
                    username = springSecurityUser.getUsername();
                }
                sb.append(username);
            }
            sb.append(" | ");
            sb.append(req.getRemoteAddr());
            log.debug(sb.toString());

        } else {
            chain.doFilter(req, resp);
        }
    }

    public void destroy() {
    }

}

