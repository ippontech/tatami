package fr.ippon.tatami.repository;

import java.util.List;

/**
 * The Trends repository : stores tags trends.
 */
public interface TrendRepository {

    void addTag(String domain, String tag);

    List<String> getRecentTags(String domain);
}
