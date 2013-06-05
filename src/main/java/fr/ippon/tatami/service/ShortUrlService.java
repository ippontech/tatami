package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.ShortUrl;
import fr.ippon.tatami.repository.ShortUrlRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

@Service
public class ShortUrlService {

    private final Log log = LogFactory.getLog(ShortUrlService.class);

    @Inject
    private ShortUrlRepository shortUrlRepository;

    public ShortUrl createShortUrl(ShortUrl shortUrl){
        shortUrl.setShortUrl(generateUrl(8));
        shortUrlRepository.createShortUrl(shortUrl);

        return shortUrl;
    }

    public ShortUrl getUrlFromKey(String key){
        if (this.log.isDebugEnabled()) {
            this.log.debug("Get url from key : "+key);
        }
        return shortUrlRepository.findUrlFromKey(key);
    }

    public String generateUrl(int num){
        String charSet = "0123456789abcdefghijkmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ";
        String key = "";

        for(int i=0; i<num; i++){
           key += charSet.charAt((int) Math.floor(Math.random() * charSet.length()));
        }

        if (this.log.isDebugEnabled()) {
            this.log.debug("Generate shorturl key : "+key);
        }

        return key;
    }

}
