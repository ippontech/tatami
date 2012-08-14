package fr.ippon.tatami.domain;

import org.codehaus.jackson.annotate.JsonIgnore;

import java.util.Collection;

/**
 * Extended information for a status.
 * - Lists the discussion related to this status
 * - Lists the users who shared this status
 */
public class StatusDetails {

    private String StatusId;

    @JsonIgnore
    private Collection<String> discussionStatusIds;

    private Collection<Status> discussionStatuses;

    private Collection<String> sharedByLogins;

    public String getStatusId() {
        return StatusId;
    }

    public void setStatusId(String statusId) {
        StatusId = statusId;
    }

    public Collection<String> getDiscussionStatusIds() {
        return discussionStatusIds;
    }

    public void setDiscussionStatusIds(Collection<String> discussionStatusIds) {
        this.discussionStatusIds = discussionStatusIds;
    }

    public Collection<Status> getDiscussionStatuses() {
        return discussionStatuses;
    }

    public void setDiscussionStatuses(Collection<Status> discussionStatuses) {
        this.discussionStatuses = discussionStatuses;
    }

    public Collection<String> getSharedByLogins() {
        return sharedByLogins;
    }

    public void setSharedByLogins(Collection<String> sharedByLogins) {
        this.sharedByLogins = sharedByLogins;
    }

    @Override
    public String toString() {
        return "StatusDetails{" +
                "StatusId='" + StatusId + '\'' +
                ", discussionStatusIds=" + discussionStatusIds +
                ", sharedByLogins=" + sharedByLogins +
                '}';
    }
}
