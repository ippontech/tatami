package fr.ippon.tatami.domain;

import static fr.ippon.tatami.domain.Tweet.tweet;
import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;

public class TweetTest {

    @Test
    public void different_tweets() {
        Tweet tweet1 = new Tweet();
        tweet1.setTweetId("1");
        Tweet tweet2 = new Tweet();
        tweet2.setTweetId("2");

        assertThat(tweet1).isNotEqualTo(tweet2);
        assertThat(tweet1.hashCode()).isNotEqualTo(tweet2.hashCode());
    }

    @Test
    public void same_tweets() {
        Tweet tweet1 = new Tweet();
        tweet1.setTweetId("1");
        Tweet tweet2 = new Tweet();
        tweet2.setTweetId("1");

        assertThat(tweet1).isEqualTo(tweet2);
        assertThat(tweet1.hashCode()).isEqualTo(tweet2.hashCode());
    }

    @Test
    public void builder() {
        Tweet tweet1 = tweet().tweetId("1").build();
        Tweet tweet2 = tweet().tweetId("2").build();
        assertThat(tweet1).isNotEqualTo(tweet2);
    }
}
