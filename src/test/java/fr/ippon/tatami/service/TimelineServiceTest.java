package fr.ippon.tatami.service;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Collection;

import javax.inject.Inject;

import org.junit.Ignore;
import org.junit.Test;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;

public class TimelineServiceTest extends AbstractCassandraTatamiTest {

    @Inject
    public TimelineService timelineService;

    @Test
    public void shouldGetUserline() throws Exception {
        String login = "userWithTweets";
        Collection<Tweet> tweets = timelineService.getUserline(login, 10);
        assertThatLineForUserWithTweetsIsOk(login, tweets);
    }

    @Test
    public void shouldGetAuthenticateUserUserlineWithNullLoginSet() throws Exception {
        String login = "userWithTweets";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login, "userWithTweets@ippon.fr");
        Collection<Tweet> tweets = timelineService.getUserline(null, 10);
        assertThatLineForUserWithTweetsIsOk(login, tweets);
    }

    @Test
    public void shouldGetAuthenticateUserUserlineWithEmptyLoginSet() throws Exception {
        String login = "userWithTweets";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login, "userWithTweets@ippon.fr");
        Collection<Tweet> tweets = timelineService.getUserline("", 10);
        assertThatLineForUserWithTweetsIsOk(login, tweets);
    }

    @Test
    public void shouldGetTimeline() throws Exception {
        String login = "userWithTweets";
        Collection<Tweet> tweets = timelineService.getTimeline(login, 10);
        assertThatLineForUserWithTweetsIsOk(login, tweets);
    }

    @Test
    public void shouldGetAuthenticateUserTimelineWithNullLoginSet() throws Exception {
        String login = "userWithTweets";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login, "userWithTweets@ippon.fr");
        Collection<Tweet> tweets = timelineService.getTimeline(null, 10);
        assertThatLineForUserWithTweetsIsOk(login, tweets);
    }

    @Test
    public void shouldGetAuthenticateUserTimelineWithEmptyLoginSet() throws Exception {
        String login = "userWithTweets";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login, "userWithTweets@ippon.fr");
        Collection<Tweet> tweets = timelineService.getTimeline("", 10);
        assertThatLineForUserWithTweetsIsOk(login, tweets);
    }

    @Test
    public void shouldPostTweet() throws Exception {
        String login = "userWhoPostTweet";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login, "userWhoPostTweet@ippon.fr");
        String content = "Longue vie au Ch'ti Jug";

        timelineService.postTweet(content);

        /* verify */
        Collection<Tweet> tweetsFromUserline = timelineService.getUserline(login, 10);
        assertThatNewTestIsPosted(login, content, tweetsFromUserline);

        Collection<Tweet> tweetsFromTimeline = timelineService.getTimeline(login, 10);
        assertThatNewTestIsPosted(login, content, tweetsFromTimeline);

        Collection<Tweet> tweetsFromTimelineOfAFollower = timelineService.getTimeline("userWhoReadTweet", 10);
        assertThatNewTestIsPosted(login, content, tweetsFromTimelineOfAFollower);

        Collection<Tweet> tweetsFromUserlineOfAFollower = timelineService.getUserline("userWhoReadTweet", 10);
        assertThat(tweetsFromUserlineOfAFollower.isEmpty(), is(true));

    }

    private void assertThatNewTestIsPosted(String login, String content, Collection<Tweet> tweets) {
        assertThat(tweets, notNullValue());
        assertThat(tweets.size(), is(1));
        Tweet tweet = (Tweet) tweets.toArray()[0];
        assertThat(tweet.getLogin(), is(login));
        assertThat(tweet.getContent(), is(content));
    }

    private void mockAuthenticationOnTimelineServiceWithACurrentUser(String login, String email) {
        User authenticateUser = constructAUser(login, email);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        timelineService.setAuthenticationService(mockAuthenticationService);
    }

    private void assertThatLineForUserWithTweetsIsOk(String login, Collection<Tweet> tweets) {
        assertThat(tweets, notNullValue());
        assertThat(tweets.size(), is(2));

        Tweet secondTweet = (Tweet) tweets.toArray()[0];
        assertThat(secondTweet.getTweetId(), is("tweetId2"));
        assertThat(secondTweet.getLogin(), is(login));
        assertThat(secondTweet.getContent(), is("Devoxx, ça va déchirer"));

        Tweet firstTweet = (Tweet) tweets.toArray()[1];
        assertThat(firstTweet.getTweetId(), is("tweetId1"));
        assertThat(firstTweet.getLogin(), is(login));
        assertThat(firstTweet.getContent(), is("Devoxx, c'est nowwwwww"));
    }

}