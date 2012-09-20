package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

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
        String login = "userWithStatus@ippon.fr";
        mockAuthenticationOnTimelineServiceWithACurrentUser("userWithStatus@ippon.fr");
        Collection<Status> status = timelineService.getUserline("userWithStatus", 10, null, null);
        assertThatLineForUserWithStatusIsOk(login, status);
    }

    @Test
    public void shouldGetAuthenticateUserUserlineWithNullLoginSet() throws Exception {
        String login = "userWithStatus@ippon.fr";
        mockAuthenticationOnTimelineServiceWithACurrentUser("userWithStatus@ippon.fr");
        Collection<Status> status = timelineService.getUserline(null, 10, null, null);
        assertThatLineForUserWithStatusIsOk(login, status);
    }

    @Test
    public void shouldGetAuthenticateUserUserlineWithEmptyLoginSet() throws Exception {
        String login = "userWithStatus@ippon.fr";
        mockAuthenticationOnTimelineServiceWithACurrentUser("userWithStatus@ippon.fr");
        Collection<Status> status = timelineService.getUserline("", 10, null, null);
        assertThatLineForUserWithStatusIsOk(login, status);
    }

    @Test
    public void shouldGetTimeline() throws Exception {
        String login = "userWithStatus@ippon.fr";
        mockAuthenticationOnTimelineServiceWithACurrentUser("userWithStatus@ippon.fr");
        Collection<Status> status = timelineService.getTimeline(10, null, null);
        assertThatLineForUserWithStatusIsOk(login, status);
    }

    @Test
    public void shouldGetTagline() throws Exception {
        mockAuthenticationOnTimelineServiceWithACurrentUser("userWithStatus@ippon.fr");
        String hashtag = "ippon";
        Collection<Status> status = timelineService.getTagline(hashtag, 10, null, null);
        assertThatLineForUserWithStatusIsOk("userWithStatus@ippon.fr", status);
    }

    private void mockAuthenticationOnTimelineServiceWithACurrentUser(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(timelineService, "authenticationService", mockAuthenticationService);
    }

    private void assertThatLineForUserWithStatusIsOk(String login, Collection<Status> status) {
        assertThat(status, notNullValue());
        assertThat(status.size(), is(2));

        Status firstStatus = (Status) status.toArray()[0];
        assertThat(firstStatus.getStatusId(), is("fa2bd770-9848-11e1-a6ca-e0f847068d52"));
        assertThat(firstStatus.getLogin(), is(login));
        assertThat(firstStatus.getContent(), is("Devoxx, c'est nowwwwww"));

        Status secondStatus = (Status) status.toArray()[1];
        assertThat(secondStatus.getStatusId(), is("f97d6470-9847-11e1-a6ca-e0f847068d52"));
        assertThat(secondStatus.getLogin(), is(login));
        assertThat(secondStatus.getContent(), is("Devoxx, ça va déchirer"));

    }
}