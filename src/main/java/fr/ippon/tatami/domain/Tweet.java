package fr.ippon.tatami.domain;

import java.util.Calendar;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import org.joda.time.Period;
import org.joda.time.PeriodType;
import org.joda.time.format.PeriodFormatter;
import org.joda.time.format.PeriodFormatterBuilder;

/**
 * A user.
 * 
 * @author Julien Dubois
 */
@Entity
@Table(name = "Tweet")
@Data
@EqualsAndHashCode(of = "tweetId")
@Builder
public class Tweet {

    private static PeriodFormatter dayFormatter = new PeriodFormatterBuilder().appendDays().appendSuffix("d").toFormatter();

    private static PeriodFormatter hourFormatter = new PeriodFormatterBuilder().appendHours().appendSuffix("h").toFormatter();

    private static PeriodFormatter minuteFormatter = new PeriodFormatterBuilder().appendMinutes().appendSuffix("m").toFormatter();

    private static PeriodFormatter secondFormatter = new PeriodFormatterBuilder().appendSeconds().appendSuffix("s").toFormatter();

    @Id
    private String tweetId;

    @Column(name = "login")
    private String login;

    @Column(name = "content")
    private String content;

    @Column(name = "tweetDate")
    private Date tweetDate;

    private String firstName;

    private String lastName;

    private String gravatar;

    public String getPrettyPrintTweetDate() {
        Period period = new Period(tweetDate.getTime(), Calendar.getInstance().getTimeInMillis(), PeriodType.dayTime());

        if (period.getDays() > 0) {
            return dayFormatter.print(period);
        } else if (period.getHours() > 0) {
            return hourFormatter.print(period);
        } else if (period.getMinutes() > 0) {
            return minuteFormatter.print(period);
        } else {
            return secondFormatter.print(period);
        }
    }
}
