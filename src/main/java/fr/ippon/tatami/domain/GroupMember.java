package fr.ippon.tatami.domain;

import com.datastax.driver.mapping.EnumType;
import com.datastax.driver.mapping.annotations.Column;
import com.datastax.driver.mapping.annotations.Enumerated;
import com.datastax.driver.mapping.annotations.PartitionKey;
import com.datastax.driver.mapping.annotations.Table;
import fr.ippon.tatami.domain.enums.GroupRoles;

import java.util.UUID;

/**
 * A member of a group.
 */
@Table(name = "group_member")
public class GroupMember {

    @PartitionKey(0)
    @Column(name = "group_id")
    private UUID groupId;

    @PartitionKey(1)
    private String login;

    @Enumerated(EnumType.STRING)
    private GroupRoles role;

    public UUID getGroupId() {
        return groupId;
    }

    public void setGroupId(UUID groupId) {
        this.groupId = groupId;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public GroupRoles getRole() {
        return role;
    }

    public void setRole(GroupRoles role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        GroupMember that = (GroupMember) o;

        if (groupId != null ? !groupId.equals(that.groupId) : that.groupId != null) return false;
        return login != null ? login.equals(that.login) : that.login == null;

    }

    @Override
    public int hashCode() {
        int result = groupId != null ? groupId.hashCode() : 0;
        result = 31 * result + (login != null ? login.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "GroupMember{" +
            "groupId=" + groupId +
            ", login='" + login + '\'' +
            ", role=" + role +
            '}';
    }

}
