package fr.ippon.tatami.service.dto;

import java.io.Serializable;

/**
 * DTO to present a "complete" status to the presentation layer.
 */
public class UserDTO implements Serializable {

    private String login;

    private String username;

    private String avatar;

    private String firstName;

    private String lastName;

    private String jobTitle;

    private String phoneNumber;

    private long attachmentsSize;

    private long statusCount;

    private long friendsCount;

    private long followersCount;

    private boolean isFriend = false;

    private boolean isFollower = false;

    private boolean isYou = false;

    private boolean isActivated=true;

    private boolean isBlocked = false;

    public boolean isActivated() {
        return isActivated;
    }

    public void setActivated(boolean activated) {
        this.isActivated = activated;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public long getAttachmentsSize() {
        return attachmentsSize;
    }

    public void setAttachmentsSize(long attachmentsSize) {
        this.attachmentsSize = attachmentsSize;
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

    public boolean isFriend() {
        return isFriend;
    }

    public void setFriend(boolean friend) {
        isFriend = friend;
    }

    public boolean isFollower() {
        return isFollower;
    }

    public void setFollower(boolean follower) {
        isFollower = follower;
    }

    public boolean isYou() {
        return isYou;
    }

    public void setYou(boolean you) {
        isYou = you;
    }

    public boolean isBlocked() {
        return isBlocked;
    }

    public void setBlocked(boolean blocked) {
        isBlocked = blocked;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserDTO user = (UserDTO) o;

        return !(username != null ? !username.equals(user.username) : user.username != null);

    }

    @Override
    public int hashCode() {
        return username != null ? username.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "username='" + username + '\'' +
                ", avatar='" + avatar + '\'' +
                ", login='" + login + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName=" + lastName + '\'' +
                ", jobTitle='" + jobTitle + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", attachmentsSize=" + attachmentsSize +
                ", statusCount=" + statusCount +
                ", friendsCount=" + friendsCount +
                ", followersCount=" + followersCount +
                ", isFriend=" + isFriend +
                ", isFollower=" + isFollower +
                ", isYou=" + isYou +
                ", isBlocked=" + isBlocked +
                ", activated=" + isActivated +
                '}';
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }
}
