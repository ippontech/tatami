package fr.ippon.tatami.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeFormatterBuilder;

import java.io.Serializable;
import java.util.Date;

public class Attachment implements Serializable {

    private static final DateTimeFormatter oldDateFormatter = new DateTimeFormatterBuilder()
            .appendDayOfMonth(1)
            .appendLiteral(' ')
            .appendMonthOfYearShortText()
            .appendLiteral(' ')
            .appendYear(4, 4)
            .toFormatter();

    private String attachmentId;

    private String filename;

    @JsonIgnore
    private Date creationDate;

    private String prettyPrintCreationDate;

    @JsonIgnore
    private byte[] content;
    
    @JsonIgnore
    private byte[] thumbnail;
    
    private boolean hasThumbnail = false;

    private long size;

    public String getAttachmentId() {
        return attachmentId;
    }

    public void setAttachmentId(String attachmentId) {
        this.attachmentId = attachmentId;
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
        DateTime dateTime = new DateTime(creationDate);
        this.prettyPrintCreationDate = oldDateFormatter.print(dateTime);
    }

    public String getPrettyPrintCreationDate() {
        return prettyPrintCreationDate;
    }

    public void setPrettyPrintCreationDate(String prettyPrintCreationDate) {
        this.prettyPrintCreationDate = prettyPrintCreationDate;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }
    
    public byte[] getThumbnail() {
    	return thumbnail;
    }
    
    public void setThumbnail(byte[] thumbnail) {
    	this.thumbnail = thumbnail;
    }
    
    public boolean getHasThumbnail() {
    	return this.hasThumbnail;
    }
    
    public void setHasThumbnail(boolean hasThumbnail) {
    	this.hasThumbnail = hasThumbnail;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Attachment that = (Attachment) o;

        return attachmentId.equals(that.attachmentId);

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
                ", prettyPrintCreationDate='" + prettyPrintCreationDate + '\'' +
                ", size=" + size +
                '}';
    }
}