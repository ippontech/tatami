package fr.ippon.tatami.repository;

import java.util.Collection;
import java.util.List;

/**
 * The Trends repository : stores and retrieves tags trends.
 */
public interface TrendRepository {

    void addTag(String domain, String tag);

    List<String> getRecentTags(String domain);

    List<String> getRecentTags(String domain, int maxNumber);

    Collection<String> getDomainTags(String domain);
}
