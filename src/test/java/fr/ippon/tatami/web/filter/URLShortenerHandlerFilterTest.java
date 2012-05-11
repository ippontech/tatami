/**
 * 
 */
package fr.ippon.tatami.web.filter;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;

import fr.ippon.tatami.repository.ShortURLRepository;

/**
 * @author dmartin
 *
 */
public class URLShortenerHandlerFilterTest {

    private static final String DEFAULT_PREFIX = "rel://";

    private ApplicationContext getParent(String prefix, String longURLFound) {
        ShortURLRepository mockURLRepository = mock(ShortURLRepository.class);
        ConfigurableEnvironment mockEnv = mock(ConfigurableEnvironment.class);
        ConfigurableApplicationContext mockParent = mock(ConfigurableApplicationContext.class);

        when(mockEnv.getProperty("tatami.short.url.prefix")).thenReturn(prefix);

        when(mockParent.getEnvironment()).thenReturn(mockEnv);
        when(mockURLRepository.getURL(any(String.class))).thenReturn(longURLFound);

        when(mockParent.getBean(ShortURLRepository.class)).thenReturn(mockURLRepository);

        return mockParent;
    }

    private ServletRequest getServletRequest(String requestURL, String servletPath) {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        when(mockRequest.getRequestURL()).thenReturn(new StringBuffer(requestURL));
        when(mockRequest.getServletPath()).thenReturn(servletPath);

        return mockRequest;
    }

    @Test
    public void doFilterNoShortURLFoundInRepository() throws IOException, ServletException {
        URLShortenerHandlerFilter filter = new URLShortenerHandlerFilter();
        filter.setParent(getParent(DEFAULT_PREFIX, null));

        ServletRequest mockRequest = getServletRequest("http://localhost:8080/s/ABCDEFGH", "/s/ABCDEFGH");
        HttpServletResponse mockResponse = mock(HttpServletResponse.class);

        filter.doFilter(mockRequest, mockResponse, mock(FilterChain.class));

        verify(mockResponse).sendError(HttpServletResponse.SC_NOT_FOUND);

    }

    @Test
    public void doFilterShortURLFoundInRepository() throws IOException, ServletException {
        final String longURL = "http://www.veryverylongurl.com";

        URLShortenerHandlerFilter filter = new URLShortenerHandlerFilter();
        filter.setParent(getParent(DEFAULT_PREFIX, longURL));

        ServletRequest mockRequest = getServletRequest("http://localhost:8080/s/ABCDEFGH", "/s/ABCDEFGH");
        HttpServletResponse mockResponse = mock(HttpServletResponse.class);

        filter.doFilter(mockRequest, mockResponse, mock(FilterChain.class));

        verify(mockResponse).setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY);
        verify(mockResponse).setHeader("Location", longURL);

    }

    @Test
    public void getShortURLPrefixWithoutProtocolRelative() throws IOException, ServletException {
        final String prefix = "rel:///s/";

        URLShortenerHandlerFilter filter = new URLShortenerHandlerFilter();
        filter.setParent(getParent(prefix, null));
        String s = filter.getShortURLPrefixWithoutProtocol();

        assertNotNull(s);
        assertEquals("/s/", s);

    }

    @Test
    public void getShortURLPrefixWithoutProtocolDomain() throws IOException, ServletException {
        final String prefix = "http://tt.mi/s/";

        URLShortenerHandlerFilter filter = new URLShortenerHandlerFilter();
        filter.setParent(getParent(prefix, null));
        String s = filter.getShortURLPrefixWithoutProtocol();

        assertNotNull(s);
        assertEquals("tt.mi/s/", s);

    }

    @Test
    public void getShortURLPrefixWithoutProtocolNoProtocol() throws IOException, ServletException {
        final String prefix = "/s/";

        URLShortenerHandlerFilter filter = new URLShortenerHandlerFilter();
        filter.setParent(getParent(prefix, null));
        String s = filter.getShortURLPrefixWithoutProtocol();

        assertNotNull(s);
        assertEquals("/s/", s);

    }

    @Test
    public void getShortURLPrefixProtocolRelative() {
        final String prefix = "rel:///s/";

        URLShortenerHandlerFilter filter = new URLShortenerHandlerFilter();
        filter.setParent(getParent(prefix, null));
        String s = filter.getShortURLPrefixProtocol();

        assertNotNull(s);
        assertEquals("rel://", s);

    }

    @Test
    public void getShortURLPrefixProtocolDomain() {
        final String prefix = "http://tt.mi/s/";

        URLShortenerHandlerFilter filter = new URLShortenerHandlerFilter();
        filter.setParent(getParent(prefix, null));
        String s = filter.getShortURLPrefixProtocol();

        assertNotNull(s);
        assertEquals("http://", s);

    }

    @Test
    public void getShortURLPrefixProtocolNoProtocol() {
        final String prefix = "/s/";

        URLShortenerHandlerFilter filter = new URLShortenerHandlerFilter();
        filter.setParent(getParent(prefix, null));
        String s = filter.getShortURLPrefixProtocol();

        assertNotNull(s);
        assertEquals("", s);

    }

}
