package fr.ippon.tatami.service.dto;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.domain.status.StatusType;
import org.joda.time.DateTime;
import org.joda.time.Period;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeFormatterBuilder;
import org.joda.time.format.ISODateTimeFormat;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;

/**
 * DTO to present a "complete" status to the presentation layer.
 */
public class StatusDTO implements Serializable {

    private static final DateTimeFormatter iso8601Formatter = ISODateTimeFormat.dateTime();

    private static final DateTimeFormatter basicDateFormatter = new DateTimeFormatterBuilder()
            .appendDayOfMonth(1)
            .appendLiteral(' ')
            .appendMonthOfYearShortText()
            .toFormatter();

    private static final DateTimeFormatter oldDateFormatter = new DateTimeFormatterBuilder()
            .appendDayOfMonth(1)
            .appendLiteral(' ')
            .appendMonthOfYearShortText()
            .appendLiteral(' ')
            .appendYear(4, 4)
            .toFormatter();

    private String statusId;

    /**
     * The timelineId is used on the client side :
     * - When this is an original status, timelineId = statusId
     * - When this is a shared status, timelineId = the id of this share in the user's timeline
     */
    private String timelineId;

    private StatusType type;

    private String username;

    private boolean statusPrivate;

    private boolean activated;

    private String groupId;

    private String groupName;

    private String geoLocalization;

    private boolean publicGroup;

    private Collection<Attachment> attachments;

    private Collection<String> attachmentIds;

    private String content;

    private Date statusDate;

    private String iso8601StatusDate;

    private String prettyPrintStatusDate;

    /**
     * If this status is a reply, the statusId of the original status.
     */
    private String replyTo;

    /**
     * If this status is a reply, the username who posted the original status.
     */
    private String replyToUsername;

    private String firstName;

    private String lastName;

    private String avatar;

    private boolean favorite;

    private boolean detailsAvailable;

    /**
     * If this status was shared, username of the user who shared it.
     */
    private String sharedByUsername;

    private boolean shareByMe;

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public boolean isShareByMe() {
        return shareByMe;
    }

    public void setShareByMe(boolean shareByMe) {
        this.shareByMe = shareByMe;
    }

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

    public StatusType getType() {
        return type;
    }

    public void setType(StatusType type) {
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isStatusPrivate() {
        return statusPrivate;
    }

    public void setStatusPrivate(boolean statusPrivate) {
        this.statusPrivate = statusPrivate;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public boolean isPublicGroup() {
        return publicGroup;
    }

    public void setPublicGroup(boolean publicGroup) {
        this.publicGroup = publicGroup;
    }

    public Collection<String> getAttachmentIds() {
        return attachmentIds;
    }

    public void setAttachmentIds(Collection<String> attachmentIds) {
        this.attachmentIds = attachmentIds;
    }

    public Collection<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(Collection<Attachment> attachments) {
        this.attachments = attachments;
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
        if (statusDate != null) {
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
        } else {
            this.iso8601StatusDate = "";
            this.prettyPrintStatusDate = "";
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

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    public boolean isDetailsAvailable() {
        return detailsAvailable;
    }

    public void setDetailsAvailable(boolean detailsAvailable) {
        this.detailsAvailable = detailsAvailable;
    }

    public String getSharedByUsername() {
        return sharedByUsername;
    }

    public void setSharedByUsername(String sharedByUsername) {
        this.sharedByUsername = sharedByUsername;
    }

    public String getGeoLocalization() {
        return geoLocalization;
    }

    public void setGeoLocalization(String geoLocalization) {
        this.geoLocalization = geoLocalization;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        StatusDTO status = (StatusDTO) o;

        return !(statusId != null ? !statusId.equals(status.statusId) : status.statusId != null);

    }

    @Override
    public int hashCode() {
        return statusId != null ? statusId.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "StatusDTO{" +
                "statusId='" + statusId + '\'' +
                ", timelineId='" + timelineId + '\'' +
                ", type=" + type +
                ", username='" + username + '\'' +
                ", statusPrivate=" + statusPrivate +
                ", groupId='" + groupId + '\'' +
                ", groupName='" + groupName + '\'' +
                ", geoLocalization='" + geoLocalization + '\'' +
                ", publicGroup=" + publicGroup +
                ", attachments=" + attachments +
                ", attachmentIds=" + attachmentIds +
                ", content='" + content + '\'' +
                ", statusDate=" + statusDate +
                ", iso8601StatusDate='" + iso8601StatusDate + '\'' +
                ", prettyPrintStatusDate='" + prettyPrintStatusDate + '\'' +
                ", replyTo='" + replyTo + '\'' +
                ", replyToUsername='" + replyToUsername + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", avatar='" + avatar + '\'' +
                ", favorite=" + favorite +
                ", detailsAvailable=" + detailsAvailable +
                ", sharedByUsername='" + sharedByUsername + '\'' +
                ", shareByMe='" + shareByMe + '\'' +
                '}';
    }
}
