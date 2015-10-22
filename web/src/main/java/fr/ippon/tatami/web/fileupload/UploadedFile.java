package fr.ippon.tatami.web.fileupload;

import java.io.Serializable;

public class UploadedFile implements Serializable {

    private String attachmentId;
    private String name;
    private Integer size;
    private String url;
    private String thumbnail_url;
    private String delete_url;
    private String delete_type;

    public UploadedFile() {
        super();
    }

    public UploadedFile(String attachmentId, String name, Integer size, String url) {
        super();
        this.attachmentId = attachmentId;
        this.name = name;
        this.size = size;
        this.url = url;
    }

    public UploadedFile(String attachmentId, String name, Integer size, String url,
                        String thumbnail_url, String delete_url, String delete_type) {
        super();
        this.attachmentId = attachmentId;
        this.name = name;
        this.size = size;
        this.url = url;
        this.thumbnail_url = thumbnail_url;
        this.delete_url = delete_url;
        this.delete_type = delete_type;
    }

    public String getAttachmentId() {
        return attachmentId;
    }

    public void setAttachmentId(String attachmentId) {
        this.attachmentId = attachmentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getThumbnail_url() {
        return thumbnail_url;
    }

    public void setThumbnail_url(String thumbnail_url) {
        this.thumbnail_url = thumbnail_url;
    }

    public String getDelete_url() {
        return delete_url;
    }

    public void setDelete_url(String delete_url) {
        this.delete_url = delete_url;
    }

    public String getDelete_type() {
        return delete_type;
    }

    public void setDelete_type(String delete_type) {
        this.delete_type = delete_type;
    }

    @Override
    public String toString() {
        return "UploadedFile{" +
                "attachmentId='" + attachmentId + '\'' +
                "name='" + name + '\'' +
                ", size=" + size +
                ", url='" + url + '\'' +
                ", thumbnail_url='" + thumbnail_url + '\'' +
                ", delete_url='" + delete_url + '\'' +
                ", delete_type='" + delete_type + '\'' +
                '}';
    }
}
