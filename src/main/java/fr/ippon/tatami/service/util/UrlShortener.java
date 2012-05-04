/**
 * 
 */
package fr.ippon.tatami.service.util;

import javax.inject.Inject;

import org.elasticsearch.common.RandomStringGenerator;
import org.springframework.stereotype.Component;

/**
 * URL shortener component.
 * @author dmartin
 *
 */
@Component
public class UrlShortener {

    @Inject
    private String shortURLPrefix;

    /**
     * Shorten the URL : a short URL should be provided to be used instead of the real long one.<br>
     * Note: The mapping between the two is not part of the responsability of this method and
     * should be managde elsewhere.
     * @param longUrl the URL to shorten
     * @return a short URL that can replace the long version
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
