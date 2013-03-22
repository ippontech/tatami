package fr.ippon.tatami.service;

import fr.ippon.tatami.repository.TrendRepository;
import fr.ippon.tatami.repository.UserTrendRepository;
import fr.ippon.tatami.web.rest.dto.Trend;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import static fr.ippon.tatami.service.util.AnalysisUtil.findMostUsedKeys;
import static fr.ippon.tatami.service.util.AnalysisUtil.incrementKeyCounterInMap;

/**
 * Analyzes trends (tags going up or down depending on the current time).
 */
@Service
public class TrendService {

    private final Log log = LogFactory.getLog(TrendService.class);

    private static final int TRENDS_SIZE = 8;

    @Inject
    private TrendRepository trendRepository;

    @Inject
    private UserTrendRepository userTrendRepository;

    @Cacheable("trends-cache")
    public List<Trend> getCurrentTrends(String domain) {
        List<String> tags = trendRepository.getRecentTags(domain);
        return calculateTrends(tags);
    }

    public Collection<String> searchTags(String domain, String startWith, int size) {
        Assert.hasLength(startWith);
        Collection<String> allTags = trendRepository.getDomainTags(domain);
        Collection<String> matchingTags = new ArrayList<String>();
        String startWithLowered = startWith.toLowerCase();
        int counter = 0;
        for (String tag : allTags) {
            if (tag.toLowerCase().startsWith(startWithLowered)) {
                matchingTags.add(tag);
                counter++;
            }
            if (counter == size) {
                break;
            }
        }
        return matchingTags;
    }

    @Cacheable("user-trends-cache")
    public List<Trend> getTrendsForUser(String login) {
        List<String> tags = userTrendRepository.getRecentTags(login);
        return calculateTrends(tags);
    }

    private List<Trend> calculateTrends(List<String> tags) {
        if (log.isDebugEnabled()) {
            log.debug("All tags: " + tags);
        }
        HashMap<String, Integer> totalTagsCount = new HashMap<String, Integer>();
        HashMap<String, Integer> recentTagsCount = new HashMap<String, Integer>();
        HashMap<String, Integer> oldTagsCount = new HashMap<String, Integer>();
        int currentPosition = 0;
        int middlePosition = tags.size() / 2;
        for (String tag : tags) {
            incrementKeyCounterInMap(totalTagsCount, tag);
            if (currentPosition <= middlePosition) {
                incrementKeyCounterInMap(recentTagsCount, tag);
            } else {
                incrementKeyCounterInMap(oldTagsCount, tag);
            }
            currentPosition++;
        }
        List<String> mostUsedTags = findMostUsedKeys(totalTagsCount);
        List<Trend> trends = new ArrayList<Trend>();
        for (String tag : mostUsedTags) {
            Trend trend = new Trend();
            trend.setTag(tag);
            Integer recentCount = recentTagsCount.get(tag);
            Integer oldCount = oldTagsCount.get(tag);
            if (oldCount != null) {
                if (recentCount != null) {
                    if (recentCount >= oldCount) {
                        trend.setTrendingUp(true);
                    } else {
                        trend.setTrendingUp(false);
                    }
                } else {
                    trend.setTrendingUp(false);
                }
            } else {
                trend.setTrendingUp(true);
            }
            trends.add(trend);
        }
        if (trends.size() > TRENDS_SIZE) {
            return trends.subList(0, TRENDS_SIZE);
        } else {
            return trends;
        }
    }

}
