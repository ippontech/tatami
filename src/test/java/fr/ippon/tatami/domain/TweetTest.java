package fr.ippon.tatami.domain;

import static java.lang.System.currentTimeMillis;
import static javax.validation.Validation.buildDefaultValidatorFactory;
import static org.fest.assertions.Assertions.assertThat;

import java.util.Calendar;
import java.util.Date;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import org.junit.Test;

public class TweetTest {

    Validator validator = buildDefaultValidatorFactory().getValidator();

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
    public void empty_tweet() {
        assertErrors(new Tweet(), 3);
    }

    @Test
    public void valid_tweet_has_no_error() {
        assertErrors(validTweet(), 0);
    }

    @Test
    public void null_content_is_invalid() {
        Tweet tweet = validTweet();
        tweet.setContent(null);
        assertErrors(tweet, 1);
    }

    @Test
    public void xss_content_is_invalid() {
        Tweet tweet = validTweet();
        tweet.setContent("<script>alert('attacked')</script>");
        assertErrors(tweet, 1);
    }

    @Test
    public void null_login_is_invalid() {
        // null
        Tweet tweet = validTweet();
        tweet.setLogin(null);
        assertErrors(tweet, 1);
    }

    @Test
    public void empty_login_is_invalid() {
        Tweet tweet = validTweet();
        tweet.setLogin("");
        assertErrors(tweet, 2);
    }

    @Test
    public void xss_login_is_invalid() {
        Tweet tweet = validTweet();
        tweet.setContent("<script>alert('attacked')</script>");
        assertErrors(tweet, 1);
    }

    @Test
    public void xss_firstname_is_invalid() {
        Tweet tweet = validTweet();
        tweet.setFirstName("<script>alert('attacked')</script>");
        assertErrors(tweet, 1);
    }

    @Test
    public void xss_lastname_is_invalid() {
        Tweet tweet = validTweet();
        tweet.setLastName("<script>alert('attacked')</script>");
        assertErrors(tweet, 1);
    }

    @Test
    public void past_tweet_date_is_invalid() {
        Tweet tweet = validTweet();
        tweet.setTweetDate(tomorrow());
        assertErrors(tweet, 1);
    }

    private Date tomorrow() {
        Calendar instance = Calendar.getInstance();
        instance.add(Calendar.DAY_OF_YEAR, 1);
        Date time = instance.getTime();
        return time;
    }

    private Tweet validTweet() {
        Tweet tweet = new Tweet();
        tweet.setLogin("login");
        tweet.setContent("good content");
        tweet.setLastName("lastname");
        tweet.setFirstName("firstname");
        tweet.setTweetDate(new Date(currentTimeMillis()));
        return tweet;
    }

    private void assertErrors(Tweet tweet, int expected) {
        Set<ConstraintViolation<Tweet>> violations = validator.validate(tweet);
        if (violations.size() != expected) {
            System.out.println(violations.size() + " errors on " + tweet);
            for (ConstraintViolation<Tweet> violation : violations) {
                System.out.println(violation);
            }
        }
        assertThat(violations).hasSize(expected);
    }

}
