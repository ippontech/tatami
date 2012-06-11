package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Status;

import javax.validation.ConstraintViolationException;
import java.util.Collection;

/**
 * The Tagline Respository.
 *
 * @author Julien Dubois
 */
public interface TaglineRepository {

    /**
     * Analyze a message in order to extract and reference eventual hashtags.
     *
     * @param status
     */
    void addStatusToTagline(Status status, String domain);

    /**
     * A tag's status.
     *
     * @param tag cannot be null, empty, nor contain a sharp character (#)
     */
    Collection<String> getTagline(String domain, String tag, int size);
}
