package fr.ippon.tatami.domain;

import java.io.Serializable;

public class UserStatusStat implements Comparable<UserStatusStat>, Serializable {

    private String email;

    private Long statusCount;

    public UserStatusStat(String email, Long count) {
        assert email != null && count != null;
        this.email = email;
        this.statusCount = count;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getStatusCount() {
        return statusCount;
    }

    public void setStatusCount(Long count) {
        this.statusCount = count;
    }

    @Override
    public int compareTo(UserStatusStat o) {
        return this.email.compareTo(o.email);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserStatusStat that = (UserStatusStat) o;

        return email.equals(that.email);

    }

    @Override
    public int hashCode() {
        return email.hashCode();
    }

    @Override
    public String toString() {
        return "UserStatusStat{" +
                "email='" + email + '\'' +
                ", statusCount=" + statusCount +
                '}';
    }
}
