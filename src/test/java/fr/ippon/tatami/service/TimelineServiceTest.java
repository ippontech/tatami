package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import org.junit.Test;

import javax.inject.Inject;
import java.util.Collection;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class TimelineServiceTest extends AbstractCassandraTatamiTest {

    @Inject
    public TimelineService timelineService;

    @Test
    public void shouldGetUserline() throws Exception {
        String login = "userWithTweets";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login, "userWithTweets@ippon.fr");
        Collection<Tweet> tweets = timelineService.getUserline(login, 10, null, null);
        assertThatLineForUserWithTweetsIsOk(login, tweets);
    }

    @Test
    public void shouldGetAuthenticateUserUserlineWithNullLoginSet() throws Exception {
        String login = "userWithTweets";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login, "userWithTweets@ippon.fr");
        Collection<Tweet> tweets = timelineService.getUserline(null, 10, null, null);
        assertThatLineForUserWithTweetsIsOk(login, tweets);
    }

    @Test
    public void shouldGetAuthenticateUserUserlineWithEmptyLoginSet() throws Exception {
        String login = "userWithTweets";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login, "userWithTweets@ippon.fr");
        Collection<Tweet> tweets = timelineService.getUserline("", 10, null, null);
        assertThatLineForUserWithTweetsIsOk(login, tweets);
    }

    @Test
    public void shouldGetTimeline() throws Exception {
        String login = "userWithTweets";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login, "userWithTweets@ippon.fr");
        Collection<Tweet> tweets = timelineService.getTimeline(10, null, null);
        assertThatLineForUserWithTweetsIsOk(login, tweets);
    }

    @Test
    public void shouldGetDayline() throws Exception {
        String date = "19042012";
        Collection<Tweet> tweets = timelineService.getDayline(date);
        assertThatLineForUserWithTweetsIsOk("userWithTweets", tweets);
    }

    @Test
    public void shouldGetTagline() throws Exception {
        String hashtag = "ippon";
        Collection<Tweet> tweets = timelineService.getTagline(hashtag, 10);
        assertThatLineForUserWithTweetsIsOk("userWithTweets", tweets);
    }

    @Test
    public void shouldPostTweet() throws Exception {
        String login = "userWhoPostTweet";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login, "userWhoPostTweet@ippon.fr");
        String content = "Longue vie au Ch'ti Jug";

        timelineService.postTweet(content);

        /* verify */
        Collection<Tweet> tweetsFromUserline = timelineService.getUserline(login, 10, null, null);
        assertThatNewTestIsPosted(login, content, tweetsFromUserline);

        Collection<Tweet> tweetsFromTimeline = timelineService.getTimeline(10, null, null);
        assertThatNewTestIsPosted(login, content, tweetsFromTimeline);

        Collection<Tweet> tweetsFromUserlineOfAFollower = timelineService.getUserline("userWhoReadTweet", 10, null, null);
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

        Tweet firstTweet = (Tweet) tweets.toArray()[0];
        assertThat(firstTweet.getTweetId(), is("fa2bd770-9848-11e1-a6ca-e0f847068d52"));
        assertThat(firstTweet.getLogin(), is(login));
        assertThat(firstTweet.getContent(), is("Devoxx, c'est nowwwwww"));

        Tweet secondTweet = (Tweet) tweets.toArray()[1];
        assertThat(secondTweet.getTweetId(), is("f97d6470-9847-11e1-a6ca-e0f847068d52"));
        assertThat(secondTweet.getLogin(), is(login));
        assertThat(secondTweet.getContent(), is("Devoxx, ça va déchirer"));

    }
}