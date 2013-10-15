package fr.ippon.tatami.domain.status;

import fr.ippon.tatami.domain.Attachment;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Collection;

/**
 * A status.
 *
 * @author Julien Dubois
 */
public class Status extends AbstractStatus {

    private String groupId;

    private Boolean statusPrivate;

    private Boolean hasAttachments;

    private Collection<Attachment> attachments;

    @NotNull
    @NotEmpty(message = "Content field is mandatory.")
    @Size(min = 1, max = 2048)
    private String content;

    /**
     * If this status is a reply, the statusId of the original status.
     */
    private String discussionId;

    /**
     * If this status is a reply, the statusId of the status that is being replied to.
     */
    private String replyTo;

    /**
     * If this status is a reply, the username of the status that is being replied to.
     */
    private String replyToUsername;

    private boolean detailsAvailable;

    private Boolean removed;

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

    public Boolean getRemoved() {
        return removed;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
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
