package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.RegistrationRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.web.controller.HomeController;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.inject.Inject;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class UserControllerTest extends AbstractCassandraTatamiTest {

    @Inject
    private UserService userService;

    @Inject
    private RegistrationRepository registrationRepository;

    private MockMvc restUserMockMvc;

    @Before
    public void setup() {
        mockAuthentication("jdubois@ippon.fr");
        UserController userController = new UserController();
        ReflectionTestUtils.setField(userController, "userService", userService);
        this.restUserMockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        HomeController homeController = new HomeController();
        ReflectionTestUtils.setField(homeController, "userService", userService);
    }

    @Test
    public void testUsersShow() throws Exception {
        restUserMockMvc.perform(get("/rest/users/jdubois")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.firstName").value("Julien"));
    }

    @Test
    public void testUserRegistration() throws Exception {
        // existing user
        restUserMockMvc.perform(post("/rest/users?email=uuser@ippon.fr")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotModified());

        // new user
        String newUserLogin = "registrationUser@ippon.fr";
        restUserMockMvc.perform(post("/rest/users?email=" + newUserLogin)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());

        String registrationKey = registrationRepository._getAllRegistrationKeyByLogin().get(newUserLogin.toLowerCase());
        assertNotNull(registrationKey);

        String validatedLogin = userService.validateRegistration(registrationKey);
        assertEquals(newUserLogin.toLowerCase(), validatedLogin);

        User validatedUser = userService.getUserByLogin(validatedLogin);
        assertNotNull(validatedUser);
    }

    private void mockAuthentication(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(userService, "authenticationService", mockAuthenticationService);
    }
}
