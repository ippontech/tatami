package fr.ippon.tatami.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import javax.validation.groups.Default;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.SafeHtml;
import org.hibernate.validator.constraints.SafeHtml.WhiteListType;

import fr.ippon.tatami.domain.validation.ContraintsUserCreation;

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
    @Email(message = "Email is invalid.")
    @Id
    @JsonIgnore
    private String login;

    @Column(name = "password")
    @JsonIgnore
    private String password;

    @Column(name = "username")
    @SafeHtml(whitelistType=WhiteListType.NONE)
    private String username;

    @Column(name = "domain")
    @JsonIgnore
    private String domain;

    @Column(name = "gravatar")
    private String gravatar;

    @NotNull
    @Size(min = 0, max = 50)
    @Column(name = "firstName")
    @SafeHtml(whitelistType=WhiteListType.NONE)
    private String firstName;

    @NotNull
    @Size(min = 0, max = 50)
    @Column(name = "lastName")
    @SafeHtml(whitelistType=WhiteListType.NONE)
    private String lastName;

    @NotNull
    @Size(min = 0, max = 100)
    @Column(name = "jobTitle")
    @SafeHtml(whitelistType=WhiteListType.NONE)
    private String jobTitle;

    @Size(min = 0, max = 20)
    @Column(name = "phoneNumber")
    @Pattern(regexp="[\\(\\)\\s\\.0-9+-]*")
    private String phoneNumber;

    @Column(name = "openIdUrl")
    @JsonIgnore
    private String openIdUrl;

    @Column(name = "theme")
    @JsonIgnore
    private String theme;

    private long statusCount;

    private long friendsCount;

    private long followersCount;

    public String getLogin() {
        return this.login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDomain() {
        return this.domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getGravatar() {
        return this.gravatar;
    }

    public void setGravatar(String gravatar) {
        this.gravatar = gravatar;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getJobTitle() {
        return this.jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getOpenIdUrl() {
        return this.openIdUrl;
    }

    public void setOpenIdUrl(String openIdUrl) {
        this.openIdUrl = openIdUrl;
    }

    public String getTheme() {
        return this.theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public long getStatusCount() {
        return this.statusCount;
    }

    public void setStatusCount(long statusCount) {
        this.statusCount = statusCount;
    }

    public long getFriendsCount() {
        return this.friendsCount;
    }

    public void setFriendsCount(long friendsCount) {
        this.friendsCount = friendsCount;
    }

    public long getFollowersCount() {
        return this.followersCount;
    }

    public void setFollowersCount(long followersCount) {
        this.followersCount = followersCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        if (!this.login.equals(user.login)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return this.login.hashCode();
    }

    @Override
    public String toString() {
        return "User{" +
                "login='" + this.login + '\'' +
                ", password='" + this.password + '\'' +
                ", username='" + this.username + '\'' +
                ", domain='" + this.domain + '\'' +
                ", gravatar='" + this.gravatar + '\'' +
                ", firstName='" + this.firstName + '\'' +
                ", lastName='" + this.lastName + '\'' +
                ", jobTitle='" + this.jobTitle + '\'' +
                ", phoneNumber='" + this.phoneNumber + '\'' +
                ", openIdUrl='" + this.openIdUrl + '\'' +
                ", theme='" + this.theme + '\'' +
                ", statusCount=" + this.statusCount +
                ", friendsCount=" + this.friendsCount +
                ", followersCount=" + this.followersCount +
                '}';
    }
}
