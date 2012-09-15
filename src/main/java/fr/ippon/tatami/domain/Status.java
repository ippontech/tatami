package fr.ippon.tatami.domain;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.hibernate.validator.constraints.NotEmpty;
import org.joda.time.DateTime;
import org.joda.time.Period;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeFormatterBuilder;
import org.joda.time.format.ISODateTimeFormat;

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
@Table(name = "Status")
public class Status {

    private static DateTimeFormatter iso8601Formatter = ISODateTimeFormat.dateTime();

    private static DateTimeFormatter basicDateFormatter = new DateTimeFormatterBuilder()
            .appendDayOfMonth(1)
            .appendLiteral(' ')
            .appendMonthOfYearShortText()
            .toFormatter();

    private static DateTimeFormatter oldDateFormatter = new DateTimeFormatterBuilder()
            .appendDayOfMonth(1)
            .appendLiteral(' ')
            .appendMonthOfYearShortText()
            .appendLiteral(' ')
            .appendYear(4, 4)
            .toFormatter();


    @Id
    private String statusId;

    /**
     * The timelineId is used on the client side :
     * - When this is an original status, timelineId = statusId
     * - When this is a shared status, timelineId = the id of this share in the user's timeline
     */
    private String timelineId;

    @NotNull
    @Column(name = "login")
    @JsonIgnore
    private String login;

    @NotNull
    @Column(name = "username")
    private String username;

    @NotNull
    @Column(name = "domain")
    @JsonIgnore
    private String domain;

    @NotNull
    @NotEmpty(message = "Content field is mandatory.")
    @Size(min = 1, max = 1024)
    @Column(name = "content")
    private String content;

    @Column(name = "statusDate")
    private Date statusDate;

    private String iso8601StatusDate;

    private String prettyPrintStatusDate;

    /**
     * If this status is a reply, the statusId of the original status.
     */
    @Column(name = "replyTo")
    private String replyTo;

    /**
     * If this status is a reply, the username who posted the original status.
     */
    @Column(name = "replyToUsername")
    private String replyToUsername;

    private String firstName;

    private String lastName;

    private String gravatar;

    private boolean favorite;

    /**
     * If this status was shared, username of the user who shared it.
     */
    private String sharedByUsername;

    @Column(name = "removed")
    @JsonIgnore
    private Boolean removed;

    public String getISO8601StatusDate() {
        return this.iso8601StatusDate;
    }

    public String getPrettyPrintStatusDate() {
        return this.prettyPrintStatusDate;
    }

    public String getStatusId() {
        return statusId;
    }

    public void setStatusId(String statusId) {
        this.statusId = statusId;
    }

    public String getTimelineId() {
        return timelineId;
    }

    public void setTimelineId(String timelineId) {
        this.timelineId = timelineId;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getStatusDate() {
        return statusDate;
    }

    public void setStatusDate(Date statusDate) {
        this.statusDate = statusDate;
        DateTime dateTime = new DateTime(statusDate);
        Period period =
                new Period(statusDate.getTime(),
                        Calendar.getInstance().getTimeInMillis());

        if (period.getMonths() < 1) { // Only format if it is more than 1 month old
            this.iso8601StatusDate = iso8601Formatter.print(dateTime);
        } else {
            this.iso8601StatusDate = "";
        }

        if (period.getYears() == 0) { // Only print the year if it is more than 1 year old
            this.prettyPrintStatusDate = basicDateFormatter.print(dateTime);
        } else {
            this.prettyPrintStatusDate = oldDateFormatter.print(dateTime);
        }
    }

    public String getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(String replyTo) {
        this.replyTo = replyTo;
    }

    public String getReplyToUsername() {
        return replyToUsername;
    }

    public void setReplyToUsername(String replyToUsername) {
        this.replyToUsername = replyToUsername;
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

    public boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    public String getSharedByUsername() {
        return sharedByUsername;
    }

    public void setSharedByUsername(String sharedByUsername) {
        this.sharedByUsername = sharedByUsername;
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

        Status status = (Status) o;

        if (statusId != null ? !statusId.equals(status.statusId) : status.statusId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return statusId != null ? statusId.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Status{" +
                "statusId='" + statusId + '\'' +
                ", timelineId='" + timelineId + '\'' +
                ", login='" + login + '\'' +
                ", username='" + username + '\'' +
                ", domain='" + domain + '\'' +
                ", content='" + content + '\'' +
                ", statusDate=" + statusDate +
                ", iso8601StatusDate='" + iso8601StatusDate + '\'' +
                ", prettyPrintStatusDate='" + prettyPrintStatusDate + '\'' +
                ", replyTo='" + replyTo + '\'' +
                ", replyToUsername='" + replyToUsername + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", gravatar='" + gravatar + '\'' +
                ", favorite=" + favorite +
                ", sharedByUsername='" + sharedByUsername + '\'' +
                ", removed=" + removed +
                '}';
    }
}
