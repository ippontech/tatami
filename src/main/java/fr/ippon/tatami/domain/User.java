package fr.ippon.tatami.domain;

import fr.ippon.tatami.domain.validation.ContraintsUserCreation;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.validation.groups.Default;

/**
 * A user.
 *
 * @author Julien Dubois
 */
@Entity
@Table(name = "User")
public class User {

    @NotEmpty(message = "Login is mandatory.", groups = {ContraintsUserCreation.class, Default.class})
    @NotNull(message = "Login is mandatory.", groups = {ContraintsUserCreation.class, Default.class})
    @Id
    private String login;

    @Email(message = "Email is invalid.")
    @Column(name = "email")
    private String email;

    @Column(name = "gravatar")
    private String gravatar;

    @NotNull
    @NotEmpty(message = "First Name field is mandatory.")
    @Size(min = 1, max = 50)
    @Column(name = "firstName")
    private String firstName;

    @NotNull
    @NotEmpty(message = "Last field is mandatory.")
    @Size(min = 1, max = 50)
    @Column(name = "lastName")
    private String lastName;

    private long statusCount;

    private long friendsCount;

    private long followersCount;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGravatar() {
        return gravatar;
    }

    public void setGravatar(String gravatar) {
        this.gravatar = gravatar;
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

    public long getStatusCount() {
        return statusCount;
    }

    public void setStatusCount(long statusCount) {
        this.statusCount = statusCount;
    }

    public long getFriendsCount() {
        return friendsCount;
    }

    public void setFriendsCount(long friendsCount) {
        this.friendsCount = friendsCount;
    }

    public long getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(long followersCount) {
        this.followersCount = followersCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        if (!login.equals(user.login)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return login.hashCode();
    }

    @Override
    public String toString() {
        return "User{" +
                "login='" + login + '\'' +
                ", email='" + email + '\'' +
                ", gravatar='" + gravatar + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", statusCount=" + statusCount +
                ", friendsCount=" + friendsCount +
                ", followersCount=" + followersCount +
                '}';
    }
}
