package fr.ippon.tatami.web.controller.form;

/**
 * Form bean to manage a user in a group.
 */
public class UserGroupMembership {

    private String groupId;

    private String username;

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        return "UserGroupMembership{" +
                "groupId='" + groupId + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
}
