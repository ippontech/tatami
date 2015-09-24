package fr.ippon.tatami.domain.status;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.dto.StatusDTO;

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

    private Collection<User> sharedByLogins;

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

    public Collection<User> getSharedByLogins() {
        return sharedByLogins;
    }

    public void setSharedByLogins(Collection<User> sharedByLogins) {
        this.sharedByLogins = sharedByLogins;
    }

    @Override
    public String toString() {
        return "StatusDetails{" +
                "StatusId='" + statusId + '\'' +
                ", discussionStatuses=" + discussionStatuses +
                ", sharedByLogins=" + sharedByLogins +
                '}';
    }
}
