/**
 * 
 */
package fr.ippon.tatami.service.util;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import org.junit.Test;

/**
 * @author dmartin
 *
 */
public class UrlShortenerTest {

    @Test
    public void shortenVeryLongURL() {
        UrlShortener us = new UrlShortener();
        String prefix = "rel://s/";
        us.setShortURLPrefix(prefix);

        String url = "http://www.averylongurl.com/a/long/path.html";
        String shortUrl = us.shorten(url);
        assertNotNull(shortUrl);
        assertEquals(UrlShortener.RANDOM_STRING_LENGTH + prefix.length(), shortUrl.length());
    }

    @Test
    public void shortenNotLongEnoughURL() {
        UrlShortener us = new UrlShortener();
        String prefix = "rel://s/";
        us.setShortURLPrefix(prefix);

        String url = "http://t.co/1";
        String shortUrl = us.shorten(url);
        assertNull(shortUrl);
    }

    @Test
    public void shortenNullLongURL() {
        UrlShortener us = new UrlShortener();
        String prefix = "rel://s/";
        us.setShortURLPrefix(prefix);

        String url = null;
        String shortUrl = us.shorten(url);
        assertNull(shortUrl);
    }

    @Test
    public void shortenEmptyLongURL() {
        UrlShortener us = new UrlShortener();
        String prefix = "rel://s/";
        us.setShortURLPrefix(prefix);

        String url = "";
        String shortUrl = us.shorten(url);
        assertNull(shortUrl);
    }

    @Test
    public void shortenBadPrefix() {
        UrlShortener us = new UrlShortener();
        String prefix = "";
        us.setShortURLPrefix(prefix);

        String url = "http://anothe.rather.long.com/url";
        String shortUrl = us.shorten(url);
        assertNull(shortUrl);
    }

}
