package fr.ippon.tatami.domain;

import org.hibernate.validator.constraints.NotEmpty;
import org.joda.time.Period;
import org.joda.time.PeriodType;
import org.joda.time.format.PeriodFormatter;
import org.joda.time.format.PeriodFormatterBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Calendar;
import java.util.Date;

/**
 * A user.
 *
 * @author Julien Dubois
 */
@Entity
@Table(name = "Tweet")
public class Tweet {

    private static PeriodFormatter dayFormatter = new PeriodFormatterBuilder()
            .appendDays()
            .appendSuffix("d").toFormatter();

    private static PeriodFormatter hourFormatter = new PeriodFormatterBuilder()
            .appendHours()
            .appendSuffix("h").toFormatter();

    private static PeriodFormatter minuteFormatter = new PeriodFormatterBuilder()
            .appendMinutes()
            .appendSuffix("m").toFormatter();

    private static PeriodFormatter secondFormatter = new PeriodFormatterBuilder()
            .appendSeconds()
            .appendSuffix("s").toFormatter();

    @Id
    private String tweetId;

    @NotNull
    @Column(name = "login")
    private String login;

    @NotNull
    @NotEmpty(message = "Content field is mandatory.")
    @Size(min = 1, max = 140)
    @Column(name = "content")
    private String content;

    @Column(name = "tweetDate")
    private Date tweetDate;

    private String firstName;

    private String lastName;

    private String gravatar;

    @Column(name = "removed")
    private Boolean removed;

    public String getPrettyPrintTweetDate() {
        Period period =
                new Period(tweetDate.getTime(),
                        Calendar.getInstance().getTimeInMillis(),
                        PeriodType.dayTime());

        if (period.getDays() > 0) {
            return dayFormatter.print(period);
        } else if (period.getHours() > 0) {
            return hourFormatter.print(period);
        } else if (period.getMinutes() > 0) {
            return minuteFormatter.print(period);
        } else if (period.getSeconds() > 0) {
            return secondFormatter.print(period);
        } else {
            return "0s";
        }
    }

    public String getTweetId() {
        return tweetId;
    }

    public void setTweetId(String tweetId) {
        this.tweetId = tweetId;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getTweetDate() {
        return tweetDate;
    }

    public void setTweetDate(Date tweetDate) {
        this.tweetDate = tweetDate;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getGravatar() {
        return gravatar;
    }

    public void setGravatar(String gravatar) {
        this.gravatar = gravatar;
    }

    public Boolean getRemoved() {
        return removed;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Tweet tweet = (Tweet) o;

        if (tweetId != null ? !tweetId.equals(tweet.tweetId) : tweet.tweetId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return tweetId != null ? tweetId.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Tweet{" +
                "tweetId='" + tweetId + '\'' +
                ", login='" + login + '\'' +
                ", content='" + content + '\'' +
                ", tweetDate=" + tweetDate +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", gravatar='" + gravatar + '\'' +
                ", removed='" + Boolean.TRUE.equals(removed) + '\'' +
                '}';
    }
}
