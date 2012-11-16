package fr.ippon.tatami.repository;

/**
 * The Tag Counter Repository.
 *
 * @author Julien Dubois
 */
public interface TagCounterRepository {

    long getTagCounter(String tag);

    void incrementTagCounter(String tag);

    void decrementTagCounter(String tag);

    void deleteTagCounter(String tag);
}
