package fr.ippon.tatami.service.dto;

/**
 * DTO to manage a user in a group.
 */
public class UserGroupDTO implements Comparable<UserGroupDTO> {

    private String login;

    private String gravatar;

    private String username;

    private String firstName;

    private String lastName;

    private String role;

    private Boolean isMember = true;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getGravatar() {
        return gravatar;
    }

    public void setGravatar(String gravatar) {
        this.gravatar = gravatar;
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

    @Override
    public int compareTo(UserGroupDTO o) {
        return this.username.compareTo(o.getUsername());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserGroupDTO userGroupDTO = (UserGroupDTO) o;

        if (!login.equals(userGroupDTO.login)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return login.hashCode();
    }

    @Override
    public String toString() {
        return "UserGroupDTO{" +
                "login='" + login + '\'' +
                ", gravatar='" + gravatar + '\'' +
                ", username='" + username + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", isMember=" + isMember +
                ", role='" + role + '\'' +
                '}';
    }
}
