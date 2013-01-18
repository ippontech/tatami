package fr.ippon.tatami.web.filter;

import net.sf.ehcache.constructs.web.filter.GzipFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Provides GZIP compression of responses, based on ehcache's GzipFilter.
 */
public class TatamiGzipFilter extends GzipFilter {

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws Exception {
        String path = ((HttpServletRequest) request).getRequestURI();
        if (!path.startsWith("/tatami/file")) {  // Do not GZIP attachments
            super.doFilter(request, response, chain);
        } else {
            chain.doFilter(request, response);
        }
    }
}
