package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.dto.StatusDTO;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class StatusUpdateServiceTest extends AbstractCassandraTatamiTest {

    @Inject
    public TimelineService timelineService;

    @Inject
    public StatusUpdateService statusUpdateService;

    @Test
    public void shouldPostStatus() throws Exception {
        String login = "userWhoPostStatus@ippon.fr";
        String username = "userWhoPostStatus";
        mockAuthenticationOnTimelineServiceWithACurrentUser("userWhoPostStatus@ippon.fr");
        mockAuthenticationOnStatusUpdateServiceWithACurrentUser("userWhoPostStatus@ippon.fr");
        String content = "Longue vie au Ch'ti Jug";

        statusUpdateService.postStatus(content, false, new ArrayList<String>());

        /* verify */
        Collection<StatusDTO> statusFromUserline = timelineService.getUserline("userWhoPostStatus", 10, null, null);
        assertThatNewTestIsPosted(username, content, statusFromUserline);

        Collection<StatusDTO> statusFromTimeline = timelineService.getTimeline(10, null, null);
        assertThatNewTestIsPosted(username, content, statusFromTimeline);

        Collection<StatusDTO> statusFromUserlineOfAFollower = timelineService.getUserline("userWhoReadStatus", 10, null, null);
        assertThat(statusFromUserlineOfAFollower.isEmpty(), is(true));

    }

    private void assertThatNewTestIsPosted(String username, String content, Collection<StatusDTO> statuses) {
        assertThat(statuses, notNullValue());
        assertThat(statuses.size(), is(1));
        StatusDTO status = (StatusDTO) statuses.toArray()[0];
        assertThat(status.getUsername(), is(username));
        assertThat(status.getContent(), is(content));
    }

    private void mockAuthenticationOnTimelineServiceWithACurrentUser(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(timelineService, "authenticationService", mockAuthenticationService);
    }

    private void mockAuthenticationOnStatusUpdateServiceWithACurrentUser(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(statusUpdateService, "authenticationService", mockAuthenticationService);
    }
}