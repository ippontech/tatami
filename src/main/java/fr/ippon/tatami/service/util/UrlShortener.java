/**
 * 
 */
package fr.ippon.tatami.service.util;

import javax.inject.Inject;

import org.elasticsearch.common.RandomStringGenerator;
import org.springframework.stereotype.Component;

/**
 * @author dmartin
 *
 */
@Component
public class UrlShortener {

    @Inject
    private String shortURLPrefix;

    /**
     * Shorten the URL
     * @param longUrl the URL to shorten
     * @return a short URL
     */
    public String shorten(final String longUrl) {
        // No need with this implementation to use the parameter
        // but can be used with another impl.
        final StringBuffer shortUrl = new StringBuffer();
        shortUrl.append(this.shortURLPrefix);
        shortUrl.append(RandomStringGenerator.randomAlphanumeric(10));

        return shortUrl.toString();
    }

}
