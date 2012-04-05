package fr.ippon.tatami.web.monitoring;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public final class XSSFilter implements Filter {
	
	private FilterConfig filter = null;
	
	@Override
    public void init(FilterConfig filter) throws ServletException {
        this.filter = filter;
    }
    
	@Override
    public void destroy() {
        this.filter = null;
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        chain.doFilter(new RequestWrapper((HttpServletRequest) request), response);
    }
}
