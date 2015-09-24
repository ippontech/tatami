package fr.ippon.tatami.web.rest.dto;

import java.io.Serializable;

/**
 * A Tag.
 */
public class Tag implements Serializable {

    private String name;

    private boolean followed;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isFollowed() {
        return followed;
    }

    public void setFollowed(boolean followed) {
        this.followed = followed;
    }

    private boolean trendingUp = false;

    public boolean isTrendingUp() {
        return trendingUp;
    }

    public void setTrendingUp(boolean trendingUp) {
        this.trendingUp = trendingUp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Tag tag = (Tag) o;

        return name.equals(tag.name);

    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }

    @Override
    public String toString() {
        return "Tag{" +
                "name='" + name + '\'' +
                ", followed='" + followed + '\'' +
                ", trendingUp='" + trendingUp + '\'' +
                '}';
    }
}
