package fr.ippon.tatami.domain;

import com.datastax.driver.mapping.annotations.Column;
import com.datastax.driver.mapping.annotations.PartitionKey;
import com.datastax.driver.mapping.annotations.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.UUID;

/**
 * A group.
 */
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
    private String description;

    @JsonIgnore
    private String domain;

    private long counter;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Group group = (Group) o;

        return id != null ? id.equals(group.id) : group.id == null;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Group{" +
            "id=" + id +
            ", publicGroup=" + publicGroup +
            ", archivedGroup=" + archivedGroup +
            ", name='" + name + '\'' +
            ", description='" + description + '\'' +
            ", domain='" + domain + '\'' +
            ", counter=" + counter +
            '}';
    }

}
