package fr.ippon.tatami.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
import java.io.Serializable;

/**
 * A user.
 *
 * @author Julien Dubois
 */
@Entity
@Table(name = "User")
public class User implements Serializable {

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
    private String username;

    @Column(name = "domain")
    @JsonIgnore
    private String domain;

    @Column(name = "avatar")
    private String avatar;

    @Size(min = 0, max = 50)
    @Column(name = "firstName")
    private String firstName;

    @Size(min = 0, max = 50)
    @Column(name = "lastName")
    private String lastName;

    @Size(min = 0, max = 100)
    @Column(name = "jobTitle")
    private String jobTitle;

    @Size(min = 0, max = 20)
    @Column(name = "phoneNumber")
    private String phoneNumber;

    @Column(name = "openIdUrl")
    @JsonIgnore
    private String openIdUrl;

    @Column(name = "preferences_mention_email")
    @JsonIgnore
    private Boolean preferencesMentionEmail;

    @Column(name = "rssUid")
    @JsonIgnore
    private String rssUid;

    @Column(name = "weekly_digest_subscription")
    @JsonIgnore
    private Boolean weeklyDigestSubscription;

    @Column(name = "daily_digest_subscription")
    @JsonIgnore
    private Boolean dailyDigestSubscription;

    @Column(name = "attachmentsSize")
    private long attachmentsSize;

    @Column(name="activated")
    private Boolean activated=true;

    private long statusCount;

    private long friendsCount;

    private long followersCount;


    public Boolean getActivated() {
        return activated;
    }

    public void setActivated(Boolean activated) {
        this.activated = activated;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
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

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getOpenIdUrl() {
        return openIdUrl;
    }

    public void setOpenIdUrl(String openIdUrl) {
        this.openIdUrl = openIdUrl;
    }

    public Boolean getPreferencesMentionEmail() {
        return preferencesMentionEmail;
    }

    public void setPreferencesMentionEmail(Boolean preferencesMentionEmail) {
        this.preferencesMentionEmail = preferencesMentionEmail;
    }

    public long getAttachmentsSize() {
        return attachmentsSize;
    }

    public void setAttachmentsSize(long attachmentsSize) {
        this.attachmentsSize = attachmentsSize < 0 ? 0 : attachmentsSize;
    }

    public String getRssUid() {
        return rssUid;
    }

    public void setRssUid(String rssUid) {
        this.rssUid = rssUid;
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

    public Boolean getWeeklyDigestSubscription() {
        return weeklyDigestSubscription;
    }

    public void setWeeklyDigestSubscription(Boolean weeklyDigestSubscription) {
        this.weeklyDigestSubscription = weeklyDigestSubscription;
    }

    public Boolean getDailyDigestSubscription() {
        return dailyDigestSubscription;
    }

    public void setDailyDigestSubscription(Boolean dailyDigestSubscription) {
        this.dailyDigestSubscription = dailyDigestSubscription;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        return login.equals(user.login);

    }

    @Override
    public int hashCode() {
        return login.hashCode();
    }

    @Override
    public String toString() {
        return "User{" +
                "login='" + login + '\'' +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                ", domain='" + domain + '\'' +
                ", avatar='" + avatar + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", jobTitle='" + jobTitle + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", openIdUrl='" + openIdUrl + '\'' +
                ", preferencesMentionEmail=" + preferencesMentionEmail +
                ", rssUid=" + rssUid +
                ", dailyDigestSubscription=" + dailyDigestSubscription +
                ", weeklyDigestSubscription=" + weeklyDigestSubscription +
                ", attachmentsSize=" + attachmentsSize +
                ", activated=" + activated +
                ", statusCount=" + statusCount +
                ", friendsCount=" + friendsCount +
                ", followersCount=" + followersCount +
                '}';
    }
}
