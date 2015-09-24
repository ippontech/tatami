package fr.ippon.tatami.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.Date;

public class Avatar implements Serializable {

    private String avatarId;

    private String filename;

    @JsonIgnore
    private Date creationDate;

    @JsonIgnore
    private byte[] content;

    private long size;

    public String getAvatarId() {
        return avatarId;
    }

    public void setAvatarId(String AvatarId) {
        this.avatarId = AvatarId;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    @Override
    public int hashCode() {
        return avatarId.hashCode();
    }

    @Override
    public String toString() {
        return "Avatar{" +
                "avatarId='" + avatarId + '\'' +
                ", filename='" + filename + '\'' +
                ", CreationDate='" + creationDate + '\'' +
                ", size=" + size +
                '}';
    }
}
