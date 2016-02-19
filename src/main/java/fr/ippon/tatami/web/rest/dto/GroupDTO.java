package fr.ippon.tatami.web.rest.dto;

import java.util.UUID;

/**
 * DTO representing a Group.
 */
public class GroupDTO {

    private UUID groupId;

    private String name;

    private String description;

    private boolean publicGroup;

    private boolean archivedGroup;

    private boolean member;

    private boolean administrator;

    private long counter;

    public UUID getGroupId() {
        return groupId;
    }

    public void setGroupId(UUID groupId) {
        this.groupId = groupId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPublicGroup() {
        return publicGroup;
    }

    public void setPublicGroup(boolean publicGroup) {
        this.publicGroup = publicGroup;
    }

    public boolean isArchivedGroup() {
        return archivedGroup;
    }

    public void setArchivedGroup(boolean archivedGroup) {
        this.archivedGroup = archivedGroup;
    }

    public boolean isMember() {
        return member;
    }

    public void setMember(boolean member) {
        this.member = member;
    }

    public boolean isAdministrator() {
        return administrator;
    }

    public void setAdministrator(boolean administrator) {
        this.administrator = administrator;
    }

    public long getCounter() {
        return counter;
    }

    public void setCounter(long counter) {
        this.counter = counter;
    }

}
