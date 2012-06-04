package fr.ippon.tatami.domain;

import java.util.Collection;
import java.util.TreeSet;

public class DayStatusStat {

    private String day;

    private Collection<UserStatusStat> stats = new TreeSet<UserStatusStat>();

    public DayStatusStat(String day) {
        super();
        this.day = day;
    }

    @Override
    public String toString() {
        return "DayStatusStat{day='" + this.day + "', stats=" + this.stats + "}";
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public Collection<UserStatusStat> getStats() {
        return stats;
    }

    public void setStats(Collection<UserStatusStat> stats) {
        this.stats = stats;
    }
}
