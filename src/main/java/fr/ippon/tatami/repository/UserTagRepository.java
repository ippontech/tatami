package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Specific Friend repository for tags.
 */
public interface UserTagRepository {

    void addTag(String domain, String login, String tag);

    void removeTag(String domain, String login, String tag);

    Collection<String> findTags(String domain, String login);
}
