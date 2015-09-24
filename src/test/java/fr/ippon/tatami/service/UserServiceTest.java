package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.dto.UserDTO;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;
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
        assertThat(user.getAvatar(), is("avatar"));
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
        User user = userService.getUserByUsername("jdubois");
        assertThat(user.getStatusCount(), is(2L));
        assertThat(user.getFollowersCount(), is(3L));
        assertThat(user.getFriendsCount(), is(4L));
    }

    @Test
    public void shouldNotGetAUserProfileByLogin() {
        User user = userService.getUserByUsername("unknownUserLogin");
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

        User createdUser = userService.getUserByUsername("username");

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
        String avatar = "newAvatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAvatar(avatar);

        userService.createUser(user);

        /* verify */
        User userToBeTheSame = userService.getUserByUsername("nuser");
        assertThat(userToBeTheSame.getLogin(), is(user.getLogin()));
        assertThat(userToBeTheSame.getFirstName(), is(user.getFirstName()));
        assertThat(userToBeTheSame.getLastName(), is(user.getLastName()));
        assertThat(userToBeTheSame.getAvatar(), is(user.getAvatar()));
        assertThat(userToBeTheSame.getStatusCount(), is(0L));
        assertThat(userToBeTheSame.getFollowersCount(), is(0L));
        assertThat(userToBeTheSame.getFriendsCount(), is(0L));
    }


    @Test
    public void shouldRegisterUserToWeeklyEmailDigest() {
        String login = "uuser@ippon.fr";

        mockAuthenticationOnUserService(login);

        userService.updateWeeklyDigestRegistration(true);
        User updatedUser = userService.getUserByLogin(login);

        assertTrue(updatedUser.getWeeklyDigestSubscription());

        userService.updateWeeklyDigestRegistration(false);
        updatedUser = userService.getUserByLogin(login);

        assertFalse(updatedUser.getWeeklyDigestSubscription());
    }


    @Test
    public void shouldRegisterUserToDailyEmailDigest() {
        String login = "uuser@ippon.fr";

        mockAuthenticationOnUserService(login);

        userService.updateDailyDigestRegistration(true);
        User updatedUser = userService.getUserByLogin(login);

        assertTrue(updatedUser.getDailyDigestSubscription());

        userService.updateDailyDigestRegistration(false);
        updatedUser = userService.getUserByLogin(login);

        assertFalse(updatedUser.getDailyDigestSubscription());
    }

    @Test
    public void testGetUsersByLogin() {
        String login1 = "uuser@ippon.fr";
        String login2 = "jdubois@ippon.fr";

        Collection<String> logins = new ArrayList<String>();
        logins.add(login1);
        logins.add(login2);

        mockAuthenticationOnUserService(login2);

        Collection<User> users = userService.getUsersByLogin(logins);

        assertEquals(2, users.size());
    }

    @Test
    public void testGetUsersForCurrentDomain() {
        mockAuthenticationOnUserService("jdubois@ippon.fr");
        Collection<User> users = userService.getUsersForCurrentDomain(0);
        assertTrue(users.size() > 10);
    }

    @Test
    public void testUpdatePassword() {
        String login = "jdubois@ippon.fr";
        mockAuthenticationOnUserService(login);

        User testUser = userService.getUserByLogin(login);
        assertNull(testUser.getPassword());

        testUser.setPassword("newPassword");
        userService.updatePassword(testUser);

        testUser = userService.getUserByLogin(login);
        assertNotNull(testUser.getPassword());
        assertNotEquals("newPassword", testUser.getPassword());
    }

    @Test
    public void testBuildUserDTOList() {
        String login = "jdubois@ippon.fr";
        mockAuthenticationOnUserService(login);

        User testUser = userService.getUserByLogin(login);
        Collection<User> users = new ArrayList<User>();
        users.add(testUser);

        Collection<UserDTO> userDTOs = userService.buildUserDTOList(users);

        assertEquals(1, userDTOs.size());
        UserDTO dto = userDTOs.iterator().next();

        assertEquals("Julien", dto.getFirstName());
        assertEquals(3, dto.getFollowersCount());
        assertEquals(4, dto.getFriendsCount());

    }

    private void mockAuthenticationOnUserService(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(userService, "authenticationService", mockAuthenticationService);
    }

}