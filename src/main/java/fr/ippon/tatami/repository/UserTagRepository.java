package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Specific Friend repository for tags.
 */
public interface UserTagRepository {

    void addTag(String login, String tag);

    void removeTag(String login, String tag);

    Collection<String> findTags(String login);
}
