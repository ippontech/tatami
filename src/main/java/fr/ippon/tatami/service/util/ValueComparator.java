package fr.ippon.tatami.service.util;

import java.util.Comparator;
import java.util.Map;

/**
 * Used to sort a Map by its values.
 */
public class ValueComparator implements Comparator<String> {

    Map<String, Integer> base;

    public ValueComparator(Map<String, Integer> base) {
        this.base = base;
    }

    // This comparator is not consistent with equals, as we do not want to merge keys
    public int compare(String a, String b) {
        if (base.get(a) >= base.get(b)) {
            return -1;
        } else {
            return 1;
        }
    }
}
