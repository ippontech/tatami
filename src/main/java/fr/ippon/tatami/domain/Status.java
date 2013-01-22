package fr.ippon.tatami.domain;

import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.Date;

/**
 * A status.
 *
 * @author Julien Dubois
 */
@Entity
@Table(name = "Status")
public class Status {

    @Id
    private String statusId;

    @NotNull
    @Column(name = "login")
    private String login;

    @NotNull
    @Column(name = "username")
    private String username;

    @NotNull
    @Column(name = "domain")
    private String domain;

    @Column(name = "groupId")
    private String groupId;

    @Column(name = "statusPrivate")
    private Boolean statusPrivate;

    @Column(name = "hasAttachments")
    private Boolean hasAttachments;

    private Collection<Attachment> attachments;

    @NotNull
    @NotEmpty(message = "Content field is mandatory.")
    @Size(min = 1, max = 2048)
    @Column(name = "content")
    private String content;

    @Column(name = "statusDate")
    private Date statusDate;

    /**
     * If this status is a reply, the statusId of the original status.
     */
    @Column(name = "discussionId")
    private String discussionId;

    /**
     * If this status is a reply, the statusId of the status that is being replied to.
     */
    @Column(name = "replyTo")
    private String replyTo;

    /**
     * If this status is a reply, the username of the status that is being replied to.
     */
    @Column(name = "replyToUsername")
    private String replyToUsername;

    private boolean detailsAvailable;

    @Column(name = "removed")
    private Boolean removed;

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

    public Date getStatusDate() {
        return statusDate;
    }

    public void setStatusDate(Date statusDate) {
        this.statusDate = statusDate;
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
                ", login='" + login + '\'' +
                ", username='" + username + '\'' +
                ", domain='" + domain + '\'' +
                ", groupId='" + groupId + '\'' +
                ", statusPrivate=" + statusPrivate +
                ", hasAttachments='" + hasAttachments + '\'' +
                ", content='" + content + '\'' +
                ", statusDate=" + statusDate +
                ", discussionId='" + discussionId + '\'' +
                ", replyTo='" + replyTo + '\'' +
                ", replyToUsername='" + replyToUsername + '\'' +
                ", detailsAvailable=" + detailsAvailable +
                ", removed=" + removed +
                '}';
    }
}
