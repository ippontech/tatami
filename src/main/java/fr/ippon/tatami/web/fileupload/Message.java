package fr.ippon.tatami.web.fileupload;

import java.io.Serializable;

public class Message implements Serializable {

    private String owner;
    private String description;
    private String filename;

    public Message() {
        super();
    }

    public Message(String owner, String description, String filename) {
        super();
        this.owner = owner;
        this.description = description;
        this.filename = filename;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    @Override
    public String toString() {
        return "Message{" +
                "owner='" + owner + '\'' +
                ", description='" + description + '\'' +
                ", filename='" + filename + '\'' +
                '}';
    }
}
