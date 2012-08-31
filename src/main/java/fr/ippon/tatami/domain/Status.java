package fr.ippon.tatami.domain;

import org.codehaus.jackson.annotate.JsonIgnore;
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
import java.util.List;

/**
 * A user.
 *
 * @author Julien Dubois
 */
@Entity
@Table(name = "Status")
public class Status {

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
    private String statusId;

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
    
    private List<String> tags;

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

    public String getPrettyPrintStatusDate() {
        Period period =
                new Period(statusDate.getTime(),
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

    public String getStatusId() {
        return statusId;
    }

    public void setStatusId(String statusId) {
        this.statusId = statusId;
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
    
    public List<String> getTags() {
		return tags;
	}

	public void setTags(List<String> tags) {
		this.tags = tags;
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
                ", login='" + login + '\'' +
                ", username='" + username + '\'' +
                ", domain='" + domain + '\'' +
                ", content='" + content + '\'' +
                ", statusDate=" + statusDate +
                ", replyTo='" + replyTo + '\'' +
                ", replyToUsername='" + replyToUsername + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", gravatar='" + gravatar + '\'' +
                ", favorite=" + favorite +
                ", sharedByUsername='" + sharedByUsername + '\'' +
                ", removed=" + removed +
                ", tags='" + tags + '\'' +
                '}';
    }
}
