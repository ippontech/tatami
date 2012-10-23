package fr.ippon.tatami.service;

import fr.ippon.tatami.repository.TrendRepository;
import fr.ippon.tatami.repository.UserTrendRepository;
import fr.ippon.tatami.service.util.ValueComparator;
import fr.ippon.tatami.web.rest.dto.Trend;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.inject.Inject;
import java.util.*;

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

    public Collection<String> searchTags(String domain, String startWith) {
    	Assert.hasLength(startWith);
    	Collection<String> allTags = trendRepository.getDomainTags(domain);
    	Collection<String> matchingTags = new ArrayList<String>();
    	String startWithLowered = startWith.toLowerCase();
    	for (String tag : allTags) {
    		if (tag.toLowerCase().startsWith(startWithLowered)) {
    			matchingTags.add(tag);
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
            addTagInMap(totalTagsCount, tag);
            if (currentPosition <= middlePosition) {
                addTagInMap(recentTagsCount, tag);
            } else {
                addTagInMap(oldTagsCount, tag);
            }
            currentPosition++;
        }
        List<String> mostUsedTags = findMostUsedTags(totalTagsCount);
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
        return trends;
    }

    private void addTagInMap(HashMap<String, Integer> totalTagsCount, String tag) {
        if (totalTagsCount.containsKey(tag)) {
            Integer total = totalTagsCount.get(tag);
            total++;
            totalTagsCount.put(tag, total);
        } else {
            totalTagsCount.put(tag, 1);
        }
    }

    private List<String> findMostUsedTags(HashMap<String, Integer> totalTagsCount) {
        ValueComparator valueComparator = new ValueComparator(totalTagsCount);
        TreeMap<String, Integer> orderedTags =
                new TreeMap<String, Integer>(valueComparator);

        orderedTags.putAll(totalTagsCount);

        if (log.isDebugEnabled()) {
            log.debug("orderedTags : " + orderedTags);
        }
        List<String> mostUsedTags = new ArrayList<String>();
        for (int i = 0; i <= TRENDS_SIZE; i++) {
            Map.Entry<String, Integer> firstEntry = orderedTags.pollFirstEntry();
            if (firstEntry != null) {
                mostUsedTags.add(firstEntry.getKey());
            }
        }
        if (log.isDebugEnabled()) {
            log.debug("Most used tags : " + mostUsedTags);
        }
        return mostUsedTags;
    }
}
