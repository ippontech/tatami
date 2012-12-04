package fr.ippon.tatami.repository;

import java.util.Collection;
import java.util.Date;
import java.util.List;

/**
 * The User Trends repository : stores user trends.
 */
public interface UserTrendRepository {

    void addTag(String login, String tag);

    List<String> getRecentTags(String login);

    Collection<String> getUserRecentTags(String login, Date endDate, int nbRecentTags);
}
