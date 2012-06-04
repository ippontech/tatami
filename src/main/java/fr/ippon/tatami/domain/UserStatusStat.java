package fr.ippon.tatami.domain;

public class UserStatusStat implements Comparable<UserStatusStat> {

    private String login;

    private Integer statusCount;

    public UserStatusStat(String login, Integer count) {
        assert login != null && count != null;
        this.login = login;
        this.statusCount = count;
    }

    /*
     * NB: "a TreeSet instance performs all element comparisons using its compareTo (or compare) method,
     * so two elements that are deemed equal by this method are, from the standpoint of the set, equal"
     */
    @Override
    public int compareTo(UserStatusStat o) {
        return this.login.compareToIgnoreCase(o.login);
    }

    @Override
    public String toString() {
        return "UserStatusStat{login='" + this.login + "', statusCount=" + this.statusCount + "}";
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public Integer getStatusCount() {
        return statusCount;
    }

    public void setStatusCount(Integer count) {
        this.statusCount = count;
    }
}