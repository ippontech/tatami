package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Trend;
import fr.ippon.tatami.repository.TrendRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.service.util.ValueComparator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.*;

/**
 * Analyses trends (tags going up or down depending on the current time).
 */
@Service
public class TrendService {

    private final Log log = LogFactory.getLog(TrendService.class);

    private static final int TRENDS_SIZE = 8;

    @Inject
    private TrendRepository trendRepository;

    public List<Trend> getCurrentTrends(String domain) {
        List<String> tags = trendRepository.getRecentTags(domain);
        if (log.isDebugEnabled()) {
            log.debug("All tags: " + tags);
        }
        HashMap<String, Integer> totalTagsCount  = new HashMap<String, Integer>();
        HashMap<String, Integer> recentTagsCount  = new HashMap<String, Integer>();
        HashMap<String, Integer> oldTagsCount  = new HashMap<String, Integer>();
        int currentPosition = 0;
        int middlePosition = tags.size() / 2;
        for(String tag : tags) {
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

    private List<String> findMostUsedTags(HashMap<String,Integer> totalTagsCount) {
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
