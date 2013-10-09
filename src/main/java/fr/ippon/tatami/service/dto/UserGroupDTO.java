package fr.ippon.tatami.service.dto;

import java.io.Serializable;

/**
 * DTO to manage a user in a group.
 */
public class UserGroupDTO implements Comparable<UserGroupDTO>, Serializable {

    private String login;

    private String avatar;

    private String username;

    private String firstName;

    private String lastName;

    private String role;

    private Boolean isMember = true;

    private boolean friend;

    private boolean activated;

    private boolean you;

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getIsMember() {
        return isMember;
    }

    public void setIsMember(Boolean isMember) {
        this.isMember = isMember;
    }

    public boolean isFriend() {
        return friend;
    }

    public void setFriend(boolean friend) {
        this.friend = friend;
    }

    public boolean isYou() {
        return you;
    }

    public void setYou(boolean you) {
        this.you = you;
    }

    @Override
    public int compareTo(UserGroupDTO o) {
        return this.username.compareTo(o.getUsername());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserGroupDTO userGroupDTO = (UserGroupDTO) o;

        return login.equals(userGroupDTO.login);

    }

    @Override
    public int hashCode() {
        return login.hashCode();
    }

    @Override
    public String toString() {
        return "UserGroupDTO{" +
                "login='" + login + '\'' +
                ", avatar='" + avatar + '\'' +
                ", username='" + username + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", isMember=" + isMember +
                ", role='" + role + '\'' +
                '}';
    }
}
