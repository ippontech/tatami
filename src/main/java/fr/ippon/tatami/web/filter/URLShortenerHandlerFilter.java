/**
 * 
 */
package fr.ippon.tatami.web.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.web.filter.GenericFilterBean;

import fr.ippon.tatami.repository.ShortURLRepository;

/**
 * Add support for short URL in Tweet messages.
 * These short URLs are intercepted by this filter and if a long URL is found in the
 * data store, the client is redirected to it (otherwise, this is a 404 error)
 * @author dmartin
 *
 */
public class URLShortenerHandlerFilter extends GenericFilterBean {

    private static final String DOUBLE_SLASH = "//";

    private ApplicationContext parent;
    private Environment env;

    public void setParent(ApplicationContext parent) {
        this.parent = parent;
        if (parent instanceof ConfigurableApplicationContext) {
            this.setEnvironment(((ConfigurableApplicationContext)parent).getEnvironment());
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

    /**
     * Based on the short URL prefix, rebuild what was the initial short URL
     * (in the particular case of the short domain name is not configured for
     * the application and the normal domain name is used instead)<br>
     * Because of the possible overlap between the short URL and the servlet path (due to the servlet context name),
     * this method helps rebuilding the original short URL
     * @param requestServletPath the request ServletPath received
     * @return what was the original short URL
     */
    private String rebuildShortURL(String requestServletPath) {
        String shortUrlPrefix = getShortURLPrefix();
        int doubleSlashIndex = shortUrlPrefix.indexOf(DOUBLE_SLASH);
        int nextSlashIndex = shortUrlPrefix.indexOf("/", doubleSlashIndex+DOUBLE_SLASH.length());
        String url = requestServletPath;
        if (nextSlashIndex != shortUrlPrefix.length()) {
            String servletContextPath = shortUrlPrefix.substring(nextSlashIndex);
            if (url.startsWith(servletContextPath)) {
                url = url.replace(servletContextPath, "");
            }
        }

        return shortUrlPrefix + url;
    }

    /* (non-Javadoc)
     * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest, javax.servlet.ServletResponse, javax.servlet.FilterChain)
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        final HttpServletRequest req = (HttpServletRequest) request;
        final HttpServletResponse res = (HttpServletResponse) response;
        getServletContext().getFilterRegistration(getFilterName()).getUrlPatternMappings();
        String shortUrl = req.getRequestURL().toString();
        if (shortUrl.indexOf(getShortURLPrefix()) == -1) { // DNS should not be set on the environment : should concatenate the URL random key with shortURLPrefix
            String servletPath = req.getServletPath();
            shortUrl = rebuildShortURL(servletPath);
        }

        ShortURLRepository repository = this.parent.getBean(ShortURLRepository.class);

        String redirectURL = repository.getURL(shortUrl);

        if (redirectURL == null) {
            res.sendError(HttpServletResponse.SC_NOT_FOUND);
        } else {
            res.setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY);
            res.setHeader("Location", redirectURL);
            res.setHeader("Connection", "close" );
        }
        return;
    }

}
