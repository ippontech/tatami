package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import org.junit.Ignore;
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
        User user = userService.getUserProfileByLogin("jdubois@ippon.fr");
        assertThat(user.getStatusCount(), is(2L));
        assertThat(user.getFollowersCount(), is(3L));
        assertThat(user.getFriendsCount(), is(4L));
    }

    @Test
    public void shouldNotGetAUserProfileByLogin() {
        User user = userService.getUserProfileByLogin("unknownUserLogin");
        assertThat(user, nullValue());
    }

    @Test
    public void shouldUpdateUser() {
        String login = "uuser@ippon.fr";
        String firstName = "UpdatedFirstName";
        String lastName = "UpdatedLastName";
        User userToUpdate = constructAUser(login, firstName, lastName);

        mockAuthenticationOnUserServiceWithACurrentUser(login);

        userService.updateUser(userToUpdate);

        User updatedUser = userService.getUserByLogin(login);

        assertThat(updatedUser.getFirstName(), is(firstName));
        assertThat(updatedUser.getLastName(), is(lastName));

    }

    @Test
    public void createUserWithUsernameAndDomain() {
        String login = "username@domain.com";

        User user = new User();
        user.setLogin(login);

        userService.createUser(user);

        User createdUser = userService.getUserProfileByLogin(login);

        assertThat(createdUser.getUsername(), is("username"));
        assertThat(createdUser.getDomain(), is("domain.com"));
        assertNotNull(createdUser.getPassword());
        assertThat(createdUser.getPassword().length(), is(20));
    }

    @Test
    public void shouldCreateAUser() {
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
        User userToBeTheSame = userService.getUserProfileByLogin(login);
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

        mockAuthenticationOnUserServiceWithACurrentUser("userWhoWantToFollow@ippon.fr");

        userService.followUser("userWhoWillBeFollowed@ippon.fr");

        /* verify */
        User userWhoFollow = userService.getUserProfileByLogin("userWhoWantToFollow@ippon.fr");
        assertThat(userWhoFollow.getFriendsCount(), is(1L));

        User userWhoIsFollowed = userService.getUserProfileByLogin("userWhoWillBeFollowed@ippon.fr");
        assertThat(userWhoIsFollowed.getFollowersCount(), is(1L));
    }
    //TODO
    //  @Test
    public void shouldNotFollowUserBecauseUserNotExist() {

        mockAuthenticationOnUserServiceWithACurrentUser("userWhoWantToFollow@ippon.fr");

        userService.followUser("unknownUser@ippon.fr");

        /* verify */
        User userWhoFollow = userService.getUserProfileByLogin("userWhoWantToFollow@ippon.fr");
        assertThat(userWhoFollow.getFriendsCount(), is(0L));
    }

    @Test
    public void shouldNotFollowUserBecauseUserAlreadyFollowed() throws Exception {

        mockAuthenticationOnUserServiceWithACurrentUser("userWhoFollow@ippon.fr");

        userService.followUser("userWhoIsFollowed@ippon.fr");

        /* verify */
        User userWhoFollow = userService.getUserProfileByLogin("userWhoFollow@ippon.fr");
        assertThat(userWhoFollow.getFriendsCount(), is(1L));
        assertThat(userWhoFollow.getFollowersCount(), is(0L));

        User userWhoIsFollowed = userService.getUserProfileByLogin("userWhoIsFollowed@ippon.fr");
        assertThat(userWhoIsFollowed.getFriendsCount(), is(0L));
        assertThat(userWhoIsFollowed.getFollowersCount(), is(1L));
    }

    @Test
    public void shouldNotFollowUserBecauseSameUser() throws Exception {

        mockAuthenticationOnUserServiceWithACurrentUser("userWhoWantToFollow@ippon.fr");

        userService.followUser("userWhoWantToFollow@ippon.fr");

        /* verify */
        User userWhoFollow = userService.getUserProfileByLogin("userWhoWantToFollow@ippon.fr");
        assertThat(userWhoFollow.getFriendsCount(), is(1L));
        assertThat(userWhoFollow.getFollowersCount(), is(0L));
    }

    @Test
    public void shouldForgetUser() {
        mockAuthenticationOnUserServiceWithACurrentUser("userWhoWantToForget@ippon.fr");

        userService.unfollowUser("userToForget@ippon.fr");

        /* verify */
        User userWhoWantToForget = userService.getUserProfileByLogin("userWhoWantToForget@ippon.fr");
        assertThat(userWhoWantToForget.getFriendsCount(), is(0L));

        User userToForget = userService.getUserProfileByLogin("userToForget@ippon.fr");
        assertThat(userToForget.getFollowersCount(), is(0L));
    }
    //TODO
    // @Test
    public void shouldNotForgetUserBecauseUserNotExist() {
        mockAuthenticationOnUserServiceWithACurrentUser("userWhoWantToForget@ippon.fr");

        userService.unfollowUser("unknownUser@ippon.fr");

        /* verify */
        User userWhoWantToForget = userService.getUserProfileByLogin("userWhoWantToForget@ippon.fr");
        assertThat(userWhoWantToForget.getFriendsCount(), is(1L));
    }

    private void mockAuthenticationOnUserServiceWithACurrentUser(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        userService.setAuthenticationService(mockAuthenticationService);
    }

}