package fr.ippon.tatami.domain;

public class UserStatusStat implements Comparable<UserStatusStat> {

    private String username;

    private Long statusCount;

    public UserStatusStat(String username, Long count) {
        assert username != null && count != null;
        this.username = username;
        this.statusCount = count;
    }

    @Override
    public int compareTo(UserStatusStat o) {
        return this.username.compareToIgnoreCase(o.username);
    }

    @Override
    public String toString() {
        return "UserStatusStat{username='" + this.username + "', statusCount=" + this.statusCount + "}";
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getStatusCount() {
        return statusCount;
    }

    public void setStatusCount(Long count) {
        this.statusCount = count;
    }
}