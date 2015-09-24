package fr.ippon.tatami.web.rest.dto;

import java.io.Serializable;

/**
 * A trend : a tag that is trending up or down.
 */
public class Trend implements Serializable {

    private String tag;

    private boolean trendingUp;

    public boolean isTrendingUp() {
        return trendingUp;
    }

    public void setTrendingUp(boolean trendingUp) {
        this.trendingUp = trendingUp;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Trend trend = (Trend) o;

        return tag.equals(trend.tag);

    }

    @Override
    public int hashCode() {
        return tag.hashCode();
    }

    @Override
    public String toString() {
        return "Trend{" +
                "tag='" + tag + '\'' +
                ", trendingUp=" + trendingUp +
                '}';
    }
}
