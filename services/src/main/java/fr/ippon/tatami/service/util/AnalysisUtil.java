package fr.ippon.tatami.service.util;

import java.util.*;

/**
 * Common functions for analysing key trends, user & group suggestions.
 */
public class AnalysisUtil {

    private static final int RESULTS_SIZE = 20;

    public static void incrementKeyCounterInMap(Map<String, Integer> map, String key) {
        if (map.containsKey(key)) {
            Integer total = map.get(key);
            total++;
            map.put(key, total);
        } else {
            map.put(key, 1);
        }
    }

    public static List<String> findMostUsedKeys(Map<String, Integer> totalTagsCount) {
        ValueComparator valueComparator = new ValueComparator(totalTagsCount);
        TreeMap<String, Integer> orderedTags =
                new TreeMap<String, Integer>(valueComparator);

        orderedTags.putAll(totalTagsCount);
        List<String> mostUsedTags = new ArrayList<String>();
        for (int i = 0; i <= RESULTS_SIZE; i++) {
            Map.Entry<String, Integer> firstEntry = orderedTags.pollFirstEntry();
            if (firstEntry != null) {
                mostUsedTags.add(firstEntry.getKey());
            }
        }
        return mostUsedTags;
    }

    public static List<String> reduceCollectionSize(List<String> list, int size) {
        if (list.size() < size) {
            return list;
        }
        Collections.shuffle(list);
        return list.subList(0, size - 1);
    }
}
