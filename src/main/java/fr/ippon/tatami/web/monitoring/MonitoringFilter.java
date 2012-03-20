package fr.ippon.tatami.web.monitoring;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import lombok.extern.apachecommons.CommonsLog;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.util.StopWatch;

/**
 * @author Julien Dubois
 */
@CommonsLog
public class MonitoringFilter implements Filter {

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
            String userName;
            Authentication authent = SecurityContextHolder.getContext().getAuthentication();
            if (authent != null) {
                Object principal = authent.getPrincipal();
                if (principal instanceof String) {
                    userName = "anonymous";
                } else {
                    User springSecurityUser = (User) principal;
                    userName = springSecurityUser.getUsername();
                }
                sb.append(userName);
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
