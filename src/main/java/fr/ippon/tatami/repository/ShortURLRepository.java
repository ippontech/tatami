/**
 *
 */
package fr.ippon.tatami.repository;

/**
 * @author dmartin
 */
public interface ShortURLRepository {

    void addURLPair(final String shortURL, final String longURL);

    String getURL(final String shortURL);

    void deleteURLPair(final String shortURL);

}
