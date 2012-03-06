package fr.ippon.tatami.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * A user.
 *
 * @author Julien Dubois
 */
@Entity
@Table(name = "Tweet")
public class Tweet {

    @Id
    private String tweetId;

    @Column(name = "email")
    private String email;

    @Column(name = "content")
    private String content;

    public String getTweetId() {
        return tweetId;
    }

    public void setTweetId(String tweetId) {
        this.tweetId = tweetId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Tweet tweet = (Tweet) o;

        if (tweetId != null ? !tweetId.equals(tweet.tweetId) : tweet.tweetId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return tweetId != null ? tweetId.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Tweet{" +
                "tweetId='" + tweetId + '\'' +
                ", email='" + email + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}
