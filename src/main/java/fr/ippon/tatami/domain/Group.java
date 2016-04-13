package fr.ippon.tatami.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.UUID;
import com.datastax.driver.mapping.annotations.*;
import org.springframework.data.elasticsearch.annotations.Document;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Mapping;
import org.springframework.data.elasticsearch.annotations.Setting;

/**
 * A group.
 */

@Table(name = "group")
@Document(indexName = "group")
@Setting(settingPath = "/config/elasticsearch/shared-settings.json")
@Mapping(mappingPath = "/config/elasticsearch/group/mappings.json")
public class Group implements Comparable<Group>, Serializable, Cloneable {

    @Id
    @PartitionKey
    private UUID groupId;

    @Column(name = "publicgroup")
    private boolean publicGroup;

    @Column(name = "archivedgroup")
    private boolean archivedGroup;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @JsonIgnore
    @Column(name = "domain")
    private String domain;


    private long counter;

    private boolean member;

    private boolean administrator;

    public UUID getGroupId() {
        return groupId;
    }

    public void setGroupId(UUID groupId) {
        this.groupId = groupId;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Group group = (Group) o;

        return groupId.equals(group.groupId);

    }

    @Override
    public int hashCode() {
        return groupId.hashCode();
    }

    @Override
    public String toString() {
        return "Group{" +
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


}
