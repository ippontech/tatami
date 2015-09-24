package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyCollection;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyList;
import static org.mockito.Mockito.*;

/**
 * @author Pierre Rust
 */
@SuppressWarnings("unchecked")
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class MailDigestServiceTest extends AbstractCassandraTatamiTest {

    @Mock
    MailService mailServiceMock;

    // Note : see the mail text in the console, you need to comment out the InjectMocks annotation
    // the test will fail but it's still useful during development if you want to work on the template
    @Inject
    @InjectMocks
    public MailDigestService mailDigestService;

    @Inject
    public UserService userService;

    @Inject
    public TimelineService timelineService;

    @Inject
    public StatusUpdateService statusUpdateService;

    @Inject
    public FriendshipService friendshipService;

    static final String DAILY_DIGEST_USER = "userWhoSubscribeToDigests@ippon.fr";
    static final String WEEKLY_DIGEST_USER = "userWhoSubscribeToWeeklyDigests@ippon.fr";

    @Before
    public void initMocks() {
        // we need to call initMocks explicitly because we use
        // SpringJUnit4ClassRunner instead of MockitoJUnitRunner
        // (to get spring injection before mockito mocking with @InjectMocks)
        MockitoAnnotations.initMocks(this);

        // reset users registrations : 
        mockAuthenticationOnUserService(DAILY_DIGEST_USER);
        userService.updateDailyDigestRegistration(false);

        mockAuthenticationOnUserService(WEEKLY_DIGEST_USER);
        userService.updateWeeklyDigestRegistration(false);
    }

    @Test
    public void order_00_shouldNotGenerateDailyDigest() {
        log.debug("In shouldNotGenerateDailyDigest");

        // Test data set has no user subscribed to weekly Digest
        // no mail should be sent.
        mailDigestService.dailyDigest();
        verifyZeroInteractions(mailServiceMock);
    }

    @Test
    public void order_01_shouldNotGenerateWeeklyDigest() {
        log.debug("In shouldNotGenerateWeeklyDigest");

        // Test data set has no user subscribed to weekly Digest
        // no mail should be sent.
        mailDigestService.dailyDigest();
        verifyZeroInteractions(mailServiceMock);
    }

    @Test
    public void order_03_shouldGenerateDailyDigestNoMessage() {
        log.debug("In shouldGenerateDailyDigestNoMessage");

        mockAuthenticationOnUserService(DAILY_DIGEST_USER);
        userService.updateDailyDigestRegistration(true);

        ArgumentCaptor<List> statuses = ArgumentCaptor.forClass(List.class);

        mailDigestService.dailyDigest();

        verify(mailServiceMock).sendDailyDigestEmail(any(User.class), statuses.capture(), anyInt(),
                anyCollection());
        assertThat(statuses.getValue().size() == 0, is(true));
    }


    @Test
    public void order_04_shouldGenerateDailyDigestOneMessage() {
        log.debug("In shouldGenerateDailyDigestOneMessage");

        mockAuthenticationOnUserService(DAILY_DIGEST_USER);
        userService.updateDailyDigestRegistration(true);

        mockAuthenticationOnFriendshipService(DAILY_DIGEST_USER);
        friendshipService.followUser("userWhoPostForDigests");

        mockAuthenticationOnTimelineServiceWithACurrentUser("userWhoPostForDigests@ippon.fr");
        mockAuthenticationOnStatusUpdateServiceWithACurrentUser("userWhoPostForDigests@ippon.fr");
        String content = "voilà un message qui devrait se retrouver dans le digest ! ";
        statusUpdateService.postStatus(content, false, new ArrayList<String>());

        ArgumentCaptor<List> statuses = ArgumentCaptor.forClass(List.class);

        mailDigestService.dailyDigest();

        verify(mailServiceMock).sendDailyDigestEmail(any(User.class), statuses.capture(), anyInt(),
                anyCollection());
        assertThat(statuses.getValue().size() == 1, is(true));
    }


    @Test
    public void order_04_shouldGenerateDailyDigestWithTwoMessages() {
        log.debug("In shouldGenerateDailyDigestWithTwoMessages");

        mockAuthenticationOnUserService(DAILY_DIGEST_USER);
        userService.updateDailyDigestRegistration(true);

        mockAuthenticationOnFriendshipService(DAILY_DIGEST_USER);
        friendshipService.followUser("userWhoPostForDigests");

        mockAuthenticationOnTimelineServiceWithACurrentUser("userWhoPostForDigests@ippon.fr");
        mockAuthenticationOnStatusUpdateServiceWithACurrentUser("userWhoPostForDigests@ippon.fr");
        String content2 = "voilà un message 2 qui devrait se retrouver dans le digest ! ";
        statusUpdateService.postStatus(content2, false, new ArrayList<String>());

        ArgumentCaptor<List> statuses = ArgumentCaptor.forClass(List.class);

        mailDigestService.dailyDigest();

        verify(mailServiceMock).sendDailyDigestEmail(any(User.class), statuses.capture(), anyInt(),
                anyCollection());
        assertThat(statuses.getValue().size() == 2, is(true));
    }

    @Test
    public void order_05_shouldGenerateDailyDigestWithManyMessages() {
        log.debug("In shouldGenerateDailyDigestWithManyMessages");

        mockAuthenticationOnUserService(DAILY_DIGEST_USER);
        userService.updateDailyDigestRegistration(true);

        mockAuthenticationOnFriendshipService(DAILY_DIGEST_USER);
        friendshipService.followUser("userWhoPostForDigests");

        mockAuthenticationOnTimelineServiceWithACurrentUser("userWhoPostForDigests@ippon.fr");
        mockAuthenticationOnStatusUpdateServiceWithACurrentUser("userWhoPostForDigests@ippon.fr");
        for (int i = 0; i < 20; i++) {
            String content2 = "voilà un message " + i + " qui devrait se retrouver dans le digest ! ";
            statusUpdateService.postStatus(content2, false, new ArrayList<String>());
        }

        ArgumentCaptor<List> statuses = ArgumentCaptor.forClass(List.class);

        mailDigestService.dailyDigest();

        verify(mailServiceMock).sendDailyDigestEmail(any(User.class), statuses.capture(), anyInt(),
                anyCollection());
        assertThat(statuses.getValue().size() == 10, is(true));
    }


    @Test
    public void order_06_shouldGenerateWeeklyDigest() {
        log.debug("In shouldGenerateWeeklyDigest");

        mockAuthenticationOnUserService(WEEKLY_DIGEST_USER);
        userService.updateWeeklyDigestRegistration(true);

        mailDigestService.weeklyDigest();
        verify(mailServiceMock).sendWeeklyDigestEmail(any(User.class), anyList(), anyInt(),
                anyCollection(), anyCollection());
    }


    @Test
    public void order_07_shouldGenerateWeeklyDigestNoMessage() {
        log.debug("In shouldGenerateWeeklyDigestNoMessage");

        mockAuthenticationOnUserService(WEEKLY_DIGEST_USER);
        userService.updateWeeklyDigestRegistration(true);

        ArgumentCaptor<List> statuses = ArgumentCaptor.forClass(List.class);

        mailDigestService.weeklyDigest();

        verify(mailServiceMock).sendWeeklyDigestEmail(any(User.class), statuses.capture(), anyInt(),
                anyCollection(), anyCollection());
        assertThat(statuses.getValue().size() == 0, is(true));
    }


    @Test
    public void order_08_shouldGenerateWeeklyDigestOneMessage() {
        log.debug("In shouldGenerateWeeklyDigestOneMessage");

        mockAuthenticationOnUserService(WEEKLY_DIGEST_USER);
        userService.updateWeeklyDigestRegistration(true);

        mockAuthenticationOnFriendshipService(WEEKLY_DIGEST_USER);
        friendshipService.followUser("userWhoPostForDigests");

        mockAuthenticationOnTimelineServiceWithACurrentUser("userWhoPostForDigests@ippon.fr");
        mockAuthenticationOnStatusUpdateServiceWithACurrentUser("userWhoPostForDigests@ippon.fr");
        String content = "voilà un message qui devrait se retrouver dans le digest ! ";
        statusUpdateService.postStatus(content, false, new ArrayList<String>());

        ArgumentCaptor<List> statuses = ArgumentCaptor.forClass(List.class);

        mailDigestService.weeklyDigest();

        verify(mailServiceMock).sendWeeklyDigestEmail(any(User.class), statuses.capture(), anyInt(),
                anyCollection(), anyCollection());
        assertThat(statuses.getValue().size() == 1, is(true));
    }


    @Test
    public void order_09_shouldGenerateWeeklyDigestWithTwoMessages() {
        log.debug("In shouldGenerateWeeklyDigestWithTwoMessages");

        mockAuthenticationOnUserService(WEEKLY_DIGEST_USER);
        userService.updateWeeklyDigestRegistration(true);

        mockAuthenticationOnFriendshipService(WEEKLY_DIGEST_USER);
        friendshipService.followUser("userWhoPostForDigests");

        mockAuthenticationOnTimelineServiceWithACurrentUser("userWhoPostForDigests@ippon.fr");
        mockAuthenticationOnStatusUpdateServiceWithACurrentUser("userWhoPostForDigests@ippon.fr");
        String content2 = "voilà un message 2 qui devrait se retrouver dans le digest ! ";
        statusUpdateService.postStatus(content2, false, new ArrayList<String>());

        ArgumentCaptor<List> statuses = ArgumentCaptor.forClass(List.class);

        mailDigestService.weeklyDigest();

        verify(mailServiceMock).sendWeeklyDigestEmail(any(User.class), statuses.capture(), anyInt(),
                anyCollection(), anyCollection());
        assertThat(statuses.getValue().size() == 2, is(true));
    }

    @Test
    public void order_10_shouldGenerateWeeklyDigestWithManyMessages() {
        log.debug("In shouldGenerateWeeklyDigestWithManyMessages");

        mockAuthenticationOnUserService(WEEKLY_DIGEST_USER);
        userService.updateWeeklyDigestRegistration(true);

        mockAuthenticationOnFriendshipService(WEEKLY_DIGEST_USER);
        friendshipService.followUser("userWhoPostForDigests");

        mockAuthenticationOnTimelineServiceWithACurrentUser("userWhoPostForDigests@ippon.fr");
        mockAuthenticationOnStatusUpdateServiceWithACurrentUser("userWhoPostForDigests@ippon.fr");
        for (int i = 0; i < 20; i++) {
            String content2 = "voilà un message " + i + " qui devrait se retrouver dans le digest ! ";
            statusUpdateService.postStatus(content2, false, new ArrayList<String>());
        }

        ArgumentCaptor<List> statuses = ArgumentCaptor.forClass(List.class);

        mailDigestService.weeklyDigest();

        verify(mailServiceMock).sendWeeklyDigestEmail(any(User.class), statuses.capture(), anyInt(),
                anyCollection(), anyCollection());
        assertThat(statuses.getValue().size() == 10, is(true));
    }

    private void mockAuthenticationOnUserService(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(userService, "authenticationService", mockAuthenticationService);
    }

    private void mockAuthenticationOnFriendshipService(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(friendshipService, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(userService, "authenticationService", mockAuthenticationService);
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
