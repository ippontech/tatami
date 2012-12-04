package fr.ippon.tatami.domain;

public class Attachment {

    private String attachmentId;

    private String filename;

    private byte[] content;

    private int size;

    public String getAttachmentId() {
        return attachmentId;
    }

    public void setAttachmentId(String attachmentId) {
        this.attachmentId = attachmentId;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Attachment that = (Attachment) o;

        if (!attachmentId.equals(that.attachmentId)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return attachmentId.hashCode();
    }

    @Override
    public String toString() {
        return "Attachment{" +
                "attachmentId='" + attachmentId + '\'' +
                ", filename='" + filename + '\'' +
                ", size=" + size +
                '}';
    }
}