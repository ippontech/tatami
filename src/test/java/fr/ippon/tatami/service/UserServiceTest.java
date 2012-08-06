package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import org.junit.Test;

import javax.inject.Inject;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class UserServiceTest extends AbstractCassandraTatamiTest {

    @Inject
    public UserService userService;

    @Test
    public void shouldGetAUserServiceInjected() {
        assertThat(userService, notNullValue());
    }

    @Test
    public void shouldGetAUserByLogin() {
        User user = userService.getUserByLogin("jdubois@ippon.fr");
        assertThat(user, notNullValue());
        assertThat(user.getGravatar(), is("gravatar"));
        assertThat(user.getFirstName(), is("Julien"));
        assertThat(user.getLastName(), is("Dubois"));
    }

    @Test
    public void shouldNotGetAUserByLogin() {
        User user = userService.getUserByLogin("unknownUserLogin");
        assertThat(user, nullValue());
    }

    @Test
    public void shouldGetAUserProfileByLogin() {
        mockAuthenticationOnUserService("jdubois@ippon.fr");
        User user = userService.getUserProfileByUsername("jdubois");
        assertThat(user.getStatusCount(), is(2L));
        assertThat(user.getFollowersCount(), is(3L));
        assertThat(user.getFriendsCount(), is(4L));
    }

    @Test
    public void shouldNotGetAUserProfileByLogin() {
        User user = userService.getUserProfileByUsername("unknownUserLogin");
        assertThat(user, nullValue());
    }

    @Test
    public void shouldUpdateUser() {
        String login = "uuser@ippon.fr";
        String firstName = "UpdatedFirstName";
        String lastName = "UpdatedLastName";
        User userToUpdate = constructAUser(login, firstName, lastName);

        mockAuthenticationOnUserService(login);

        userService.updateUser(userToUpdate);

        User updatedUser = userService.getUserByLogin(login);

        assertThat(updatedUser.getFirstName(), is(firstName));
        assertThat(updatedUser.getLastName(), is(lastName));

    }

    @Test
    public void createUserWithUsernameAndDomain() {
        mockAuthenticationOnUserService("currentuser@domain.com");

        String login = "username@domain.com";
        User user = new User();
        user.setLogin(login);
        userService.createUser(user);

        User createdUser = userService.getUserProfileByUsername("username");

        assertThat(createdUser.getUsername(), is("username"));
        assertThat(createdUser.getDomain(), is("domain.com"));
        assertNotNull(createdUser.getPassword());
        assertThat(createdUser.getPassword().length(), is(80)); // Size of the encrypted password
    }

    @Test
    public void shouldCreateAUser() {
        mockAuthenticationOnUserService("currentuser@ippon.fr");
        String login = "nuser@ippon.fr";
        String firstName = "New";
        String lastName = "User";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        userService.createUser(user);

        /* verify */
        User userToBeTheSame = userService.getUserProfileByUsername("nuser");
        assertThat(userToBeTheSame.getLogin(), is(user.getLogin()));
        assertThat(userToBeTheSame.getFirstName(), is(user.getFirstName()));
        assertThat(userToBeTheSame.getLastName(), is(user.getLastName()));
        assertThat(userToBeTheSame.getGravatar(), is(user.getGravatar()));
        assertThat(userToBeTheSame.getStatusCount(), is(0L));
        assertThat(userToBeTheSame.getFollowersCount(), is(0L));
        assertThat(userToBeTheSame.getFriendsCount(), is(0L));
    }

    @Test
    public void shouldFollowUser() {

        mockAuthenticationOnUserService("userWhoWantToFollow@ippon.fr");

        User userWhoWillBeFollowed = new User();
        userWhoWillBeFollowed.setLogin("userWhoWillBeFollowed@ippon.fr");
        userService.createUser(userWhoWillBeFollowed);

        userService.followUser("userWhoWillBeFollowed");

        /* verify */
        User userWhoFollow = userService.getUserProfileByUsername("userWhoWantToFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(1L));

        User userWhoIsFollowed = userService.getUserProfileByUsername("userWhoWillBeFollowed");
        assertThat(userWhoIsFollowed.getFollowersCount(), is(1L));
    }

    @Test
    public void shouldNotFollowUserBecauseUserNotExist() {

        mockAuthenticationOnUserService("userWhoWantToFollow@ippon.fr");

        userService.followUser("unknownUser");

        /* verify */
        User userWhoFollow = userService.getUserProfileByUsername("userWhoWantToFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(1L));
    }

    @Test
    public void shouldNotFollowUserBecauseUserAlreadyFollowed() throws Exception {

        mockAuthenticationOnUserService("userWhoFollow@ippon.fr");

        userService.followUser("userWhoIsFollowed");

        /* verify */
        User userWhoFollow = userService.getUserProfileByUsername("userWhoFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(1L));
        assertThat(userWhoFollow.getFollowersCount(), is(0L));

        User userWhoIsFollowed = userService.getUserProfileByUsername("userWhoIsFollowed");
        assertThat(userWhoIsFollowed.getFriendsCount(), is(0L));
        assertThat(userWhoIsFollowed.getFollowersCount(), is(1L));
    }

    @Test
    public void shouldNotFollowUserBecauseSameUser() throws Exception {

        mockAuthenticationOnUserService("userWhoWantToFollow@ippon.fr");

        userService.followUser("userWhoWantToFollow");

        /* verify */
        User userWhoFollow = userService.getUserProfileByUsername("userWhoWantToFollow");
        assertThat(userWhoFollow.getFriendsCount(), is(1L));
        assertThat(userWhoFollow.getFollowersCount(), is(0L));
    }

    @Test
    public void shouldForgetUser() {
        mockAuthenticationOnUserService("userWhoWantToForget@ippon.fr");

        User userWhoWantToForget = userService.getUserProfileByUsername("userWhoWantToForget");
        assertThat(userWhoWantToForget.getFriendsCount(), is(1L));

        User userToForget = new User();
        userToForget.setLogin("userToForget@ippon.fr");
        userService.createUser(userToForget);

        userService.unfollowUser("userToForget");

        /* verify */
        userWhoWantToForget = userService.getUserProfileByUsername("userWhoWantToForget");
        assertThat(userWhoWantToForget.getFriendsCount(), is(0L));

        User userWhoIsForgotten = userService.getUserProfileByUsername("userToForget");
        assertThat(userWhoIsForgotten.getFollowersCount(), is(0L));
    }

    @Test
    public void shouldNotForgetUserBecauseUserNotExist() {
        mockAuthenticationOnUserService("userWhoWantToForget@ippon.fr");

        userService.unfollowUser("unknownUser");

        /* verify */
        User userWhoWantToForget = userService.getUserProfileByUsername("userWhoWantToForget");
        assertThat(userWhoWantToForget.getFriendsCount(), is(0L));
    }

    private void mockAuthenticationOnUserService(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        userService.setAuthenticationService(mockAuthenticationService);
    }

}