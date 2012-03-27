package fr.ippon.tatami.domain;

import java.util.Collection;
import java.util.TreeSet;

public class DayTweetStat {
	private String day;
	private Collection<UserTweetStat> stats = new TreeSet<UserTweetStat>();

	public DayTweetStat(String day) {
		super();
		this.day = day;
	}

	@Override
	public String toString() {
        return "DayTweetStat{day='" + this.day + "', stats=" + this.stats + "}";
	}

	public String getDay() {
		return day;
	}
	public void setDay(String day) {
		this.day = day;
	}
	public Collection<UserTweetStat> getStats() {
		return stats;
	}
	public void setStats(Collection<UserTweetStat> stats) {
		this.stats = stats;
	}
}
