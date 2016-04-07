package fr.ippon.tatami.domain.status;

import com.datastax.driver.mapping.annotations.Column;
import com.datastax.driver.mapping.annotations.PartitionKey;
import com.datastax.driver.mapping.annotations.Table;
import com.datastax.driver.mapping.annotations.Transient;
import fr.ippon.tatami.domain.Attachment;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.Date;
import java.util.UUID;

/**
 * A status.
 *
 * @author Julien Dubois
 */
@Table(name="status")
public class Status implements AbstractStatus {
    @PartitionKey
    private UUID statusId;

    @NotNull
    @Column
    private StatusType type;

    @NotNull
    @Column
    private String email;

    @NotNull
    @Column
    private String username;

    @NotNull
    @Column
    private String domain;

    @Column
    private Date statusDate;

    public String getGeoLocalization() {
        return geoLocalization;
    }

    public void setGeoLocalization(String geoLocalization) {
        this.geoLocalization = geoLocalization;
    }

    @Column
    private String geoLocalization;

    @Column
    private boolean removed;

    public UUID getStatusId() {
        return statusId;
    }

    public void setStatusId(UUID statusId) {
        this.statusId = statusId;
    }

    public StatusType getType() {
        return type;
    }

    public void setType(StatusType type) {
        this.type = type;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public Date getStatusDate() {
        return statusDate;
    }

    public void setStatusDate(Date statusDate) {
        this.statusDate = statusDate;
    }

    public boolean isRemoved() {
        return removed;
    }

    public void setRemoved(boolean removed) {
        this.removed = removed;
    }


    @Column
    private String groupId;

    @Column
    private Boolean statusPrivate;

    @Column
    private Boolean hasAttachments;

    @Transient
    private Collection<Attachment> attachments;

    @NotNull
    @NotEmpty(message = "Content field is mandatory.")
    @Size(min = 1, max = 2048)
    @Column
    private String content;

    /**
     * If this status is a reply, the statusId of the original status.
     */
    @Column
    private String discussionId;

    /**
     * If this status is a reply, the statusId of the status that is being replied to.
     */
    @Column
    private String replyTo;

    /**
     * If this status is a reply, the username of the status that is being replied to.
     */
    @Column
    private String replyToUsername;

    @Transient
    private boolean detailsAvailable;


    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public Boolean getStatusPrivate() {
        return statusPrivate;
    }

    public void setStatusPrivate(Boolean statusPrivate) {
        this.statusPrivate = statusPrivate;
    }

    public Boolean getHasAttachments() {
        return hasAttachments;
    }

    public void setHasAttachments(Boolean hasAttachments) {
        this.hasAttachments = hasAttachments;
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

    public String getDiscussionId() {
        return discussionId;
    }

    public void setDiscussionId(String discussionId) {
        this.discussionId = discussionId;
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

    public boolean isDetailsAvailable() {
        return detailsAvailable;
    }

    public void setDetailsAvailable(boolean detailsAvailable) {
        this.detailsAvailable = detailsAvailable;
    }

    @Override
    public String toString() {
        return "Status{" +
                "groupId='" + groupId + '\'' +
                ", statusPrivate=" + statusPrivate +
                ", hasAttachments=" + hasAttachments +
                ", attachments=" + attachments +
                ", content='" + content + '\'' +
                ", discussionId='" + discussionId + '\'' +
                ", replyTo='" + replyTo + '\'' +
                ", replyToUsername='" + replyToUsername + '\'' +
                ", detailsAvailable=" + detailsAvailable +
                ", removed=" + removed +
                '}';
    }
}
