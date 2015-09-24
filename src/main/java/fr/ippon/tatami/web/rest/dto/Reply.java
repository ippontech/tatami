package fr.ippon.tatami.web.rest.dto;

import java.io.Serializable;

/**
 * Reply to a Status.
 */
public class Reply implements Serializable {

    private String statusId;

    private String content;

    public String getStatusId() {
        return statusId;
    }

    public void setStatusId(String statusId) {
        this.statusId = statusId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "Reply{" +
                "statusId='" + statusId + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}
