/**
 *
 */
package fr.ippon.tatami.service.util;

import javax.inject.Inject;

import org.apache.commons.lang.StringUtils;
import org.elasticsearch.common.RandomStringGenerator;
import org.springframework.stereotype.Component;

/**
 * URL shortener component.
 *
 * @author dmartin
 */
@Component
public class UrlShortener {

    public static final int RANDOM_STRING_LENGTH = 8;

    @Inject
    private String shortURLPrefix;

    /**
     * Set the prefix to be used to build the short URL.
     * It can be a short domain name, like 'http://tt.mi/s' or a dedicated protocol like 'rel://' for instance...
     * @param shortURLPrefix
     */
    public void setShortURLPrefix(String shortURLPrefix) {
        this.shortURLPrefix = shortURLPrefix;
    }

    /**
     * Shorten the URL : a short URL is returned to be used instead of the real long one.<br>
     * If the longUrl is not so long and appears to be shorter than the expected short one, null is returned.<br>
     * If the longUrl provided as a parameter is null or blank, null is also returned.<br>
     * Note: The mapping between the two URL is not part of the responsibility of this method and
     * should be managed elsewhere.
     *
     * @param longUrl the URL to shorten
     * @return a short URL that can replace the long version or null if the  value is null or empty
     */
    public String shorten(final String longUrl) {
        // This implementation do not use the 'longUrl' parameter to generate the short URL.

        if (StringUtils.isBlank(this.shortURLPrefix)) {
            return null;
        }

        if (StringUtils.isBlank(longUrl) || getShortenLength() >= longUrl.length() ) {
            return null;
        }

        final StringBuffer shortUrl = new StringBuffer();
        shortUrl.append(this.shortURLPrefix);
        shortUrl.append(RandomStringGenerator.randomAlphanumeric(RANDOM_STRING_LENGTH));

        return shortUrl.toString();
    }

    /**
     * Return the expected length of the short URL
     * @return the length
     */
    public int getShortenLength() {
        return this.shortURLPrefix.length() + RANDOM_STRING_LENGTH;
    }

}
