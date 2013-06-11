package fr.ippon.tatami.domain.status;

/**
 * Mention a user that someone started following him.
 */
public class MentionFriend extends AbstractStatus {

    private String followerLogin;

    public String getFollowerLogin() {
        return followerLogin;
    }

    public void setFollowerLogin(String followerLogin) {
        this.followerLogin = followerLogin;
    }

    @Override
    public String toString() {
        return "MentionFriend{" +
                "followerLogin='" + followerLogin + '\'' +
                "} " + super.toString();
    }
}
