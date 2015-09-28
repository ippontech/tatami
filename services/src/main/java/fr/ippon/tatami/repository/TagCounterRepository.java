package fr.ippon.tatami.repository;

/**
 * The Tag Counter Repository.
 *
 * @author Julien Dubois
 */
public interface TagCounterRepository {

    long getTagCounter(String domain, String tag);

    void incrementTagCounter(String domain, String tag);

    void decrementTagCounter(String domain, String tag);

    void deleteTagCounter(String domain, String tag);
}
