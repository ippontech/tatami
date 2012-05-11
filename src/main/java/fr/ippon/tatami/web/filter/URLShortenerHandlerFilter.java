package fr.ippon.tatami.web.filter;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.web.filter.GenericFilterBean;

import fr.ippon.tatami.repository.ShortURLRepository;

/**
 * Add support for short URL in Tweet messages.
 * These short URLs are intercepted by this filter and if a long URL is found in the
 * data store, the client is redirected to it (otherwise, this is a 404 error)
 *
 * @author dmartin
 */
public class URLShortenerHandlerFilter extends GenericFilterBean {

    public static final String HTTP_HEADER_LOCATION = "Location";
    public static final String HTTP_HEADER_CONNECTION = "Connection";

    private static final String DEFAULT_PROTOCOL = "http://";

    private final Log log = LogFactory.getLog(URLShortenerHandlerFilter.class);
    private final Pattern p = Pattern.compile("([a-zA-Z]+:\\/\\/)(.+)");

    private ApplicationContext parent;
    private Environment env;
    private ShortURLRepository repository = null;

    public void setParent(ApplicationContext parent) {
        this.parent = parent;
        if (parent instanceof ConfigurableApplicationContext) {
            this.setEnvironment(((ConfigurableApplicationContext) parent).getEnvironment());
        }
    }

    @Override
    public void setEnvironment(Environment env) {
        super.setEnvironment(env);
        this.env = env;
    }

    public String getShortURLPrefix() {
        return this.env.getProperty("tatami.short.url.prefix");
    }

    public String getShortURLPrefixWithoutProtocol() {

        final String shortURL = getShortURLPrefix();
        final Matcher m = this.p.matcher(shortURL);
        if (m.matches() && m.groupCount() == 2) {
            try {
                return m.group(2);
            } catch (IllegalStateException e) {
                this.log.debug("RegEx error", e);
            } catch (IndexOutOfBoundsException e) {
                this.log.debug("RegEx error", e);
            }
        }
        return shortURL;
    }

    /**
     * Return the protocol specified in the short URL prefix, or an empty string if any
     * @return
     */
    public String getShortURLPrefixProtocol() {

        final String shortURL = getShortURLPrefix();
        final Matcher m = this.p.matcher(shortURL);
        if (m.matches() && m.groupCount() == 2) {
            try {
                return m.group(1);
            } catch (IllegalStateException e) {
                this.log.debug("RegEx error", e);
            } catch (IndexOutOfBoundsException e) {
                this.log.debug("RegEx error", e);
            }
        }
        return "";
    }

    private ShortURLRepository getShortURLRepository() {
        if (this.repository == null) {
            synchronized (this.parent) {
                this.repository = this.parent.getBean(ShortURLRepository.class);
            }
        }
        return this.repository;
    }

    /**
     * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest, javax.servlet.ServletResponse, javax.servlet.FilterChain)
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        if (getShortURLPrefix() == null) {
            chain.doFilter(request, response);
            return;
        }

        final HttpServletRequest req = (HttpServletRequest) request;
        final HttpServletResponse res = (HttpServletResponse) response;
        String shortUrl = req.getRequestURL().toString();
        if (getShortURLPrefixWithoutProtocol() != null && shortUrl.indexOf(getShortURLPrefixWithoutProtocol()) != 1) {
            // Request URL and shortURLPrefix don't start the same.
            // In this case, short URL should be relative : have to rebuild what was the relative shorten URL :
            shortUrl = getShortURLPrefixProtocol() + req.getServletPath();
        }

        String redirectURL = getShortURLRepository().getURL(shortUrl);

        if (redirectURL == null) {
            res.sendError(HttpServletResponse.SC_NOT_FOUND);
        } else {
            // check if redirectURL doesn't start with 'zzzz' if DEFAULT_PROTOCOL is 'zzzz://'. If not, concatenate the DEFAULT_PROTOCOL
            if (!redirectURL.startsWith(DEFAULT_PROTOCOL.substring(0, DEFAULT_PROTOCOL.length() - 3))) {
                redirectURL = DEFAULT_PROTOCOL + redirectURL;
            }
            res.setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY);
            res.setHeader(HTTP_HEADER_LOCATION, redirectURL);
            res.setHeader(HTTP_HEADER_CONNECTION, "close");
        }
        return;
    }

}
