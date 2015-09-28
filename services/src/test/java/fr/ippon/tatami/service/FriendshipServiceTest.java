package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Inject;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class FriendshipServiceTest extends AbstractCassandraTatamiTest {

    @Inject
    public UserService userService;

    @Inject
    public FriendshipService friendshipService;

    @Test
    public void shouldGetAUserServiceInjected() {
        assertThat(userService, notNullValue());
    }

    @Test
    public void shouldGetAFollowerServiceInjected() {
        assertThat(friendshipService, notNullValue());
    }

    @Test
    public void shouldFollowUser() {

        mockAuthentication("userWhoWantToFollow@ippon.fr");

        User userWhoWillBeFollowed = new User();
        userWhoWillBeFollowed.setLogin("userWhoWillBeFollowed@ippon.fr");
        userService.createUser(userWhoWillBeFollowed);
        userWhoWillBeFollowed.setDailyDigestSubscription(false);
        userWhoWillBeFollowed.setWeeklyDigestSubscription(false);
        userService.updateUser(userWhoWillBeFollowed);

        User userWhoFollow = userService.getUserByUsername("userWhoWantToFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(0L));

        assertTrue(friendshipService.followUser("userWhoWillBeFollowed"));

        /* verify */
        userWhoFollow = userService.getUserByUsername("userWhoWantToFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(1L));

        User userWhoIsFollowed = userService.getUserByUsername("userWhoWillBeFollowed");
        assertThat(userWhoIsFollowed.getFollowersCount(), is(1L));

        // Clean up
        friendshipService.unfollowUser("userWhoWillBeFollowed");
    }

    @Test
    public void shouldNotFollowUserBecauseUserDoesNotExist() {

        mockAuthentication("userWhoWantToFollow@ippon.fr");

        assertFalse(friendshipService.followUser("unknownUser"));

        /* verify */
        User userWhoFollow = userService.getUserByUsername("userWhoWantToFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(0L));
    }

    @Test
    public void shouldNotFollowUserBecauseUserIsAlreadyFollowed() throws Exception {

        mockAuthentication("userWhoFollow@ippon.fr");

        assertFalse(friendshipService.followUser("userWhoIsFollowed"));

        /* verify */
        User userWhoFollow = userService.getUserByUsername("userWhoFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(1L));
        assertThat(userWhoFollow.getFollowersCount(), is(0L));

        User userWhoIsFollowed = userService.getUserByUsername("userWhoIsFollowed");
        assertThat(userWhoIsFollowed.getFriendsCount(), is(0L));
        assertThat(userWhoIsFollowed.getFollowersCount(), is(1L));
    }

    @Test
    public void shouldNotFollowUserBecauseSameUser() throws Exception {

        mockAuthentication("userWhoWantToFollow@ippon.fr");

        User userWhoFollow = userService.getUserByUsername("userWhoWantToFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(0L));
        assertThat(userWhoFollow.getFollowersCount(), is(0L));

        assertFalse(friendshipService.followUser("userWhoWantToFollow"));

        /* verify */
        userWhoFollow = userService.getUserByUsername("userWhoWantToFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(0L));
        assertThat(userWhoFollow.getFollowersCount(), is(0L));
    }

    @Test
    public void shouldForgetUser() {
        mockAuthentication("userWhoWantToForget@ippon.fr");

        User userWhoWantToForget = userService.getUserByUsername("userWhoWantToForget");
        assertThat(userWhoWantToForget.getFriendsCount(), is(1L));

        User userToForget = new User();
        userToForget.setLogin("userToForget@ippon.fr");
        userService.createUser(userToForget);
        userToForget.setDailyDigestSubscription(false);
        userToForget.setWeeklyDigestSubscription(false);
        userService.updateUser(userToForget);

        assertTrue(friendshipService.unfollowUser("userToForget"));
        userWhoWantToForget = userService.getUserByUsername("userWhoWantToForget");
        assertThat(userWhoWantToForget.getFriendsCount(), is(0L));
        User userWhoIsForgotten = userService.getUserByUsername("userToForget");
        assertThat(userWhoIsForgotten.getFollowersCount(), is(0L));
    }

    @Test
    public void shouldNotForgetUserBecauseUserDoesNotExist() {
        mockAuthentication("userWhoWantToForget@ippon.fr");

        assertFalse(friendshipService.unfollowUser("unknownUser"));

        /* verify */
        User userWhoWantToForget = userService.getUserByUsername("userWhoWantToForget");
        assertThat(userWhoWantToForget.getFriendsCount(), is(0L));
    }

    private void mockAuthentication(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(friendshipService, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(userService, "authenticationService", mockAuthenticationService);
    }
}