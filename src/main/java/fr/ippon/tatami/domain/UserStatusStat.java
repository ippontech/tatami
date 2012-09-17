package fr.ippon.tatami.domain;

public class UserStatusStat implements Comparable<UserStatusStat> {

    private String username;

    private Long statusCount;

    public UserStatusStat(String username, Long count) {
        assert username != null && count != null;
        this.username = username;
        this.statusCount = count;
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

    @Override
    public int compareTo(UserStatusStat o) {
        return this.username.compareTo(o.username);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserStatusStat that = (UserStatusStat) o;

        if (!username.equals(that.username)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return username.hashCode();
    }

    @Override
    public String toString() {
        return "UserStatusStat{" +
                "username='" + username + '\'' +
                ", statusCount=" + statusCount +
                '}';
    }
}