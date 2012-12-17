package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Inject;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
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

        friendshipService.followUser("userWhoWillBeFollowed");

        /* verify */
        User userWhoFollow = userService.getUserByUsername("userWhoWantToFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(1L));

        User userWhoIsFollowed = userService.getUserByUsername("userWhoWillBeFollowed");
        assertThat(userWhoIsFollowed.getFollowersCount(), is(1L));
    }

    @Test
    public void shouldNotFollowUserBecauseUserNotExist() {

        mockAuthentication("userWhoWantToFollow@ippon.fr");

        friendshipService.followUser("unknownUser");

        /* verify */
        User userWhoFollow = userService.getUserByUsername("userWhoWantToFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(1L));
    }

    @Test
    public void shouldNotFollowUserBecauseUserAlreadyFollowed() throws Exception {

        mockAuthentication("userWhoFollow@ippon.fr");

        friendshipService.followUser("userWhoIsFollowed");

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

        friendshipService.followUser("userWhoWantToFollow");

        /* verify */
        User userWhoFollow = userService.getUserByUsername("userWhoWantToFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(1L));
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

        friendshipService.unfollowUser("userToForget");

        /* verify */
        userWhoWantToForget = userService.getUserByUsername("userWhoWantToForget");
        assertThat(userWhoWantToForget.getFriendsCount(), is(0L));

        User userWhoIsForgotten = userService.getUserByUsername("userToForget");
        assertThat(userWhoIsForgotten.getFollowersCount(), is(0L));
    }

    @Test
    public void shouldNotForgetUserBecauseUserNotExist() {
        mockAuthentication("userWhoWantToForget@ippon.fr");

        friendshipService.unfollowUser("unknownUser");

        /* verify */
        User userWhoWantToForget = userService.getUserByUsername("userWhoWantToForget");
        assertThat(userWhoWantToForget.getFriendsCount(), is(0L));
    }

    private void mockAuthentication(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        friendshipService.setAuthenticationService(mockAuthenticationService);
        ReflectionTestUtils.setField(userService, "authenticationService", mockAuthenticationService);
    }

}