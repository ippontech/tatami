package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Timed;
import fr.ippon.tatami.domain.ShortUrl;
import fr.ippon.tatami.service.ShortUrlService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

@Controller
public class ShortUrlController {

    private final Log log = LogFactory.getLog(ShortUrlController.class);

    private String tatamiUrl;

    @Inject
    private Environment env;

    @Inject
    ShortUrlService shortUrlService;

    @PostConstruct
    public void init() {
        this.tatamiUrl = env.getProperty("tatami.url");
    }

    /**
     * GET  rest/s create a random key for shorturl
     */

    @RequestMapping(value = "/rest/s",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public ShortUrl createShortUrl(@RequestParam(required = false) String url) {

        ShortUrl shortUrl = new ShortUrl();
        shortUrl.setLongUrl(url);

        shortUrlService.createShortUrl(shortUrl);

        if (this.log.isDebugEnabled()) {
            this.log.info("REST get short url : "+ tatamiUrl +"/s/"+ shortUrl.getShortUrl());
        }

        return shortUrl;
    }

}
