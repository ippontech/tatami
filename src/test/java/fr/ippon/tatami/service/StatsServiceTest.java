package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.UserStatusStat;
import fr.ippon.tatami.security.AuthenticationService;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Inject;
import java.util.Calendar;
import java.util.Collection;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class StatsServiceTest extends AbstractCassandraTatamiTest {

    @Inject
    public StatsService statsService;

    @Test
    public void shouldGetDayline() throws Exception {
        mockAuthenticationOnStatsServiceWithACurrentUser("userWithStatus@ippon.fr");
        Calendar cal = Calendar.getInstance();
        cal.set(2012, 04, 19);
        Collection<UserStatusStat> stats = statsService.getDayline(cal.getTime());
        assertThat(stats, notNullValue());
        assertThat(stats.size(), is(1));

        UserStatusStat userStat = (UserStatusStat) stats.toArray()[0];
        assertThat(userStat.getUsername(), is("userWithStatus"));
        assertThat(userStat.getStatusCount(), is(1L));
    }

    private void mockAuthenticationOnStatsServiceWithACurrentUser(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(statsService, "authenticationService", mockAuthenticationService);
    }
}
