package fr.ippon.tatami.domain.status;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.web.rest.dto.StatusDTO;

import java.io.Serializable;
import java.util.Collection;

/**
 * Extended information for a status.
 * - Lists the discussion related to this status
 * - Lists the users who shared this status
 */
public class StatusDetails implements Serializable {

    private String statusId;

    private Collection<StatusDTO> discussionStatuses;

    private Collection<User> sharedByEmails;

    public String getStatusId() {
        return statusId;
    }

    public void setStatusId(String statusId) {
        this.statusId = statusId;
    }

    public Collection<StatusDTO> getDiscussionStatuses() {
        return discussionStatuses;
    }

    public void setDiscussionStatuses(Collection<StatusDTO> discussionStatuses) {
        this.discussionStatuses = discussionStatuses;
    }

    public Collection<User> getSharedByEmails() {
        return sharedByEmails;
    }

    public void setSharedByEmails(Collection<User> sharedByEmails) {
        this.sharedByEmails = sharedByEmails;
    }

    @Override
    public String toString() {
        return "StatusDetails{" +
                "StatusId='" + statusId + '\'' +
                ", discussionStatuses=" + discussionStatuses +
                ", sharedByEmails=" + sharedByEmails +
                '}';
    }
}
