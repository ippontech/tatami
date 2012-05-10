/**
 *
 */
package fr.ippon.tatami.service.util;

import org.apache.commons.lang.StringUtils;
import org.elasticsearch.common.RandomStringGenerator;
import org.springframework.stereotype.Component;

import javax.inject.Inject;

/**
 * URL shortener component.
 *
 * @author dmartin
 */
@Component
public class UrlShortener {

    private static final int RANDOM_STRING_LENGTH = 8;

    @Inject
    private String shortURLPrefix;


    /**
     * Shorten the URL : a short URL should be provided to be used instead of the real long one.<br>
     * Note: The mapping between the two is not part of the responsibility of this method and
     * should be managed elsewhere.
     *
     * @param longUrl the URL to shorten
     * @return a short URL that can replace the long version or null if the  value is null or empty
     */
    public String shorten(final String longUrl) {
        // No need with this implementation to use the parameter
        // but can be used with another impl.
        if (StringUtils.isBlank(this.shortURLPrefix)) {
            return null;
        }
        final StringBuffer shortUrl = new StringBuffer();
        shortUrl.append(this.shortURLPrefix);
        shortUrl.append(RandomStringGenerator.randomAlphanumeric(RANDOM_STRING_LENGTH));

        return shortUrl.toString();
    }

}
