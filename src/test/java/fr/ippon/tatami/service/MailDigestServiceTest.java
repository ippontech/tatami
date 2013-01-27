package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Inject;

import static org.mockito.Matchers.*;
import static org.mockito.Mockito.*;

/**
 * @author Pierre Rust
 */

public class MailDigestServiceTest extends AbstractCassandraTatamiTest {


    @Mock
    MailService mailServiceMock;

    @Inject
    @InjectMocks
    public MailDigestService mailDigestService;

    @Inject
    public UserService userService;


    @Before
    public void initMocks() {
        // we need to call initMocks explicitly because we use
        // SpringJUnit4ClassRunner instead of MockitoJUnitRunner
        // (to get spring injection before mockito mocking with @InjectMocks)
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void shouldNotGenerateDailyDigest(){

        // Test data set has no user subscribed to daily Digest
        // no mail should be sent.

        mailDigestService.dailyDigest();
        verifyZeroInteractions(mailServiceMock);
    }

    @Test
    public void shouldNotGenerateWeeklyDigest(){

        // Test data set has no user subscribed to weekly Digest
        // no mail should be sent.

        mailDigestService.dailyDigest();
        verifyZeroInteractions(mailServiceMock);
    }

    @Test
    public void shouldGenerateDailyDigest(){

        mockAuthenticationOnUserService("jdubois@ippon.fr");
        User user = userService.getUserByLogin("jdubois@ippon.fr");
        userService.updateDailyDigestRegistration(true);

        mailDigestService.dailyDigest();
        verify(mailServiceMock).sendDailyDigestEmail(any(User.class), anyList(), anyInt(),
                anyCollection());
    }

    @Test
    public void shouldGenerateWeeklyDigest(){

        mockAuthenticationOnUserService("jdubois@ippon.fr");
        User user = userService.getUserByLogin("jdubois@ippon.fr");
        userService.updateWeeklyDigestRegistration(true);

        mailDigestService.weeklyDigest();
        verify(mailServiceMock).sendWeeklyDigestEmail(any(User.class), anyList(), anyInt(),
                anyCollection(), anyCollection());
    }

    private void mockAuthenticationOnUserService(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(userService, "authenticationService", mockAuthenticationService);
    }

}
