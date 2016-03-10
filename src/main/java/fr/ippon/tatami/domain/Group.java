package fr.ippon.tatami.domain;

<<<<<<< HEAD
import com.datastax.driver.mapping.annotations.Column;
import com.datastax.driver.mapping.annotations.PartitionKey;
import com.datastax.driver.mapping.annotations.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.validation.constraints.Size;
=======

import com.fasterxml.jackson.annotation.JsonIgnore;

>>>>>>> story-transitionToJhipster
import java.io.Serializable;
import java.util.UUID;

/**
 * A group.
 */
<<<<<<< HEAD
@Table(name = "group")
public class Group implements Serializable {

    @PartitionKey
    private UUID id;

    @Column(name = "public_group")
    private boolean publicGroup;

    @Column(name = "archived_group")
    private boolean archivedGroup;

    @Size(min = 1, max = 50)
    private String name;

    @Size(min = 1, max = 100)
=======
public class Group implements Comparable<Group>, Serializable, Cloneable {

    private UUID groupId;

    private boolean publicGroup;

    private boolean archivedGroup;

    private String name;

>>>>>>> story-transitionToJhipster
    private String description;

    @JsonIgnore
    private String domain;

    private long counter;

<<<<<<< HEAD
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
=======
    private boolean member;

    private boolean administrator;

    public UUID getGroupId() {
        return groupId;
    }

    public void setGroupId(UUID groupId) {
        this.groupId = groupId;
>>>>>>> story-transitionToJhipster
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

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public long getCounter() {
        return counter;
    }

    public void setCounter(long counter) {
        this.counter = counter;
    }

<<<<<<< HEAD
=======
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

    @Override
    public int compareTo(Group o) {
        if (this.getName() == null) {
            return -1;
        }
        if (o.getName() == null) {
            return 1;
        }
        if (this.getName().equals(o.getName())) {
            return this.getGroupId().compareTo(o.getGroupId()); // To display duplicates
        }
        return this.getName().compareTo(o.getName());
    }

>>>>>>> story-transitionToJhipster
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Group group = (Group) o;

<<<<<<< HEAD
        return id != null ? id.equals(group.id) : group.id == null;
=======
        return groupId.equals(group.groupId);

>>>>>>> story-transitionToJhipster
    }

    @Override
    public int hashCode() {
<<<<<<< HEAD
        return id != null ? id.hashCode() : 0;
=======
        return groupId.hashCode();
>>>>>>> story-transitionToJhipster
    }

    @Override
    public String toString() {
        return "Group{" +
<<<<<<< HEAD
            "id=" + id +
            ", publicGroup=" + publicGroup +
            ", archivedGroup=" + archivedGroup +
            ", name='" + name + '\'' +
            ", description='" + description + '\'' +
            ", domain='" + domain + '\'' +
            ", counter=" + counter +
            '}';
    }

=======
                "groupId='" + groupId + '\'' +
                ", publicGroup=" + publicGroup +
                ", archivedGroup=" + archivedGroup +
                ", name='" + name + '\'' +
                ", domain='" + domain + '\'' +
                ", counter=" + counter +
                ", member=" + member +
                ", administrator=" + administrator +
                '}';
    }

    @Override
    public Object clone() {
        Group clone = null;
        try {
            clone = (Group) super.clone();
        } catch (CloneNotSupportedException cnse) {
            cnse.printStackTrace(System.err);
        }
        return clone;
    }


>>>>>>> story-transitionToJhipster
}
