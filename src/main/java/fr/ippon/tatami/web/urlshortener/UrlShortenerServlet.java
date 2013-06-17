package fr.ippon.tatami.web.urlshortener;

import fr.ippon.tatami.domain.ShortUrl;
import fr.ippon.tatami.service.ShortUrlService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.inject.Inject;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@WebServlet(value = "/s/*")
public class UrlShortenerServlet extends HttpServlet {

    private final Log log = LogFactory.getLog(UrlShortenerServlet.class);

    private ShortUrlService shortUrlService;

    @Override
    public void init(ServletConfig config) throws ServletException {
        shortUrlService =
                WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext()).getBean(ShortUrlService.class);
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String key = req.getPathInfo().replace("/","");

        ShortUrl url = shortUrlService.getUrlFromKey(key);

        if (this.log.isDebugEnabled()) {
            this.log.debug("Get long url from UrlShortenerServlet : "+ url.getLongUrl());
        }

        if(url.getLongUrl().equals(null) || "".equals(url.getLongUrl())){
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }

        resp.sendRedirect(url.getLongUrl());
    }
}
