package fr.ippon.tatami.domain;

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
}
