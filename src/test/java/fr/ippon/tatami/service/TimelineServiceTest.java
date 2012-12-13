package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.dto.StatusDTO;
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
        String username = "userWithStatus";
        String login = "userWithStatus@ippon.fr";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login);
        Collection<StatusDTO> status = timelineService.getUserline(username, 10, null, null);
        assertThatLineForUserWithStatusIsOk(username, status);
    }

    @Test
    public void shouldGetAuthenticateUserUserlineWithNullLoginSet() throws Exception {
        String login = "userWithStatus@ippon.fr";
        mockAuthenticationOnTimelineServiceWithACurrentUser("userWithStatus@ippon.fr");
        Collection<StatusDTO> status = timelineService.getUserline(null, 10, null, null);
        assertThatLineForUserWithStatusIsOk("userWithStatus", status);
    }

    @Test
    public void shouldGetAuthenticateUserUserlineWithEmptyLoginSet() throws Exception {
        String login = "userWithStatus@ippon.fr";
        String username = "userWithStatus";
        mockAuthenticationOnTimelineServiceWithACurrentUser("userWithStatus@ippon.fr");
        Collection<StatusDTO> status = timelineService.getUserline("", 10, null, null);
        assertThatLineForUserWithStatusIsOk(username, status);
    }

    @Test
    public void shouldGetTimeline() throws Exception {
        String login = "userWithStatus@ippon.fr";
        String username = "userWithStatus";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login);
        Collection<StatusDTO> status = timelineService.getTimeline(10, null, null);
        assertThatLineForUserWithStatusIsOk(username, status);
    }

    @Test
    public void shouldGetTagline() throws Exception {
        String login = "userWithStatus@ippon.fr";
        String username = "userWithStatus";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login);
        String hashtag = "ippon";
        Collection<StatusDTO> status = timelineService.getTagline(hashtag, 10, null, null);
        assertThatLineForUserWithStatusIsOk(username, status);
    }

    private void mockAuthenticationOnTimelineServiceWithACurrentUser(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(timelineService, "authenticationService", mockAuthenticationService);
    }

    private void assertThatLineForUserWithStatusIsOk(String username, Collection<StatusDTO> status) {
        assertThat(status, notNullValue());
        assertThat(status.size(), is(2));

        StatusDTO firstStatus = (StatusDTO) status.toArray()[0];
        assertThat(firstStatus.getStatusId(), is("fa2bd770-9848-11e1-a6ca-e0f847068d52"));
        assertThat(firstStatus.getUsername(), is(username));
        assertThat(firstStatus.getContent(), is("Tatami is an enterprise social network"));

        StatusDTO secondStatus = (StatusDTO) status.toArray()[1];
        assertThat(secondStatus.getStatusId(), is("f97d6470-9847-11e1-a6ca-e0f847068d52"));
        assertThat(secondStatus.getUsername(), is(username));
        assertThat(secondStatus.getContent(), is("Tatami is fully Open Source"));

    }
}