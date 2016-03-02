package fr.ippon.tatami.web.rest.dto;

/**
 * Created by lnorregaard on 02/12/15.
 */
public class AvatarMeta {
    private String avatarId;

    private String filename;

    private long size;

    public String getAvatarId() {
        return avatarId;
    }

    public void setAvatarId(String avatarId) {
        this.avatarId = avatarId;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }
}
