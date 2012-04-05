package fr.ippon.tatami.repository;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;

import org.junit.Test;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.Tweet;

public class TwitterRepositoryTest extends AbstractCassandraTatamiTest {

    @Inject
    public TweetRepository tweetRepository;

    @Test
    public void shouldGetATwitterRepositoryInjected() {
        assertThat(tweetRepository, notNullValue());
    }
    
    @Test
    public void shouldCreateATweet() {
        String login = "jdubois";
        String content = "content";
        
        Tweet tweet = new Tweet();
        tweet.setContent(content);
        tweet.setLogin(login);

        assertThat(tweetRepository.createTweet(login,content), notNullValue());
    }
    
    @Test (expected=ValidationException.class) 
    public void shouldNotCreateATweetBecauseLoginNull() {
        String login = null;
        String content = "content";
        
        Tweet tweet = new Tweet();
        tweet.setContent(content);
        tweet.setLogin(login);

        tweetRepository.createTweet(login,content);
    }
    
    @Test (expected=ConstraintViolationException.class) 
    public void shouldNotCreateATweetBecauseContentNull() {
    	String login = "login";
        String content = null;
        
        Tweet tweet = new Tweet();
        tweet.setContent(content);
        tweet.setLogin(login);

        tweetRepository.createTweet(login,content);
    }
    
    @Test (expected=ConstraintViolationException.class) 
    public void shouldNotCreateATweetBecauseContentEmpty() {
    	String login = "login";
        String content = "";
        
        Tweet tweet = new Tweet();
        tweet.setContent(content);
        tweet.setLogin(login);

        tweetRepository.createTweet(login,content);
    }
    
    @Test (expected=ConstraintViolationException.class) 
    public void shouldNotCreateATweetBecauseContentTooLarge() {
    	String login = "login";
        String content = "01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789+";
        
        Tweet tweet = new Tweet();
        tweet.setContent(content);
        tweet.setLogin(login);

        tweetRepository.createTweet(login,content);
    }
}