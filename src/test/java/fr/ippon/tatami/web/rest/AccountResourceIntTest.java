package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.Application;
import fr.ippon.tatami.TestUtil;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.AuthoritiesConstants;
import fr.ippon.tatami.service.MailService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.web.rest.dto.UserDTO;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the AccountResource REST controller.
 *
 * @see UserService
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebIntegrationTest
public class AccountResourceIntTest {

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserService mockUserService;

    @Mock
    private MailService mockMailService;

    private MockMvc restAccountMock;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        doNothing().when(mockMailService).sendActivationEmail(anyObject(), anyString());

        AccountResource accountResource = new AccountResource();
        ReflectionTestUtils.setField(accountResource, "userRepository", userRepository);
        ReflectionTestUtils.setField(accountResource, "userService", mockUserService);
        ReflectionTestUtils.setField(accountResource, "mailService", mockMailService);

        this.restAccountMock = MockMvcBuilders.standaloneSetup(accountResource).build();
    }

    @Test
    public void testNonAuthenticatedUser() throws Exception {
        restAccountMock.perform(get("/tatami/authenticate")
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string(""));
    }

    @Test
    public void testAuthenticatedUser() throws Exception {
        restAccountMock.perform(get("/tatami/authenticate")
            .with(request -> {
                request.setRemoteUser("test");
                return request;
            })
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string("test"));
    }

    @Test
    public void testGetExistingAccount() throws Exception {
        restAccountMock.perform(get("/tatami/rest/account/profile")
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())//----------------------
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.username").value("admin"))
            .andExpect(jsonPath("$.firstName").isEmpty())
            .andExpect(jsonPath("$.lastName").value("Administrator"))
            .andExpect(jsonPath("$.email").value("admin@localhost"))
            .andExpect(jsonPath("$.authorities", hasSize(2)))
            .andExpect(jsonPath("$.jobTitle").value("Developer"))
            .andExpect(jsonPath("$.jobDescription").isEmpty())
            .andExpect(jsonPath("$.phoneNumber").value("8041234567"))
            .andExpect(jsonPath("$.mentionEmail").value(true))
            .andExpect(jsonPath("$.rssUid").isEmpty())
            .andExpect(jsonPath("$.weeklyDigest").value(false))
            .andExpect(jsonPath("$.dailyDigest").value(false))
            .andExpect(jsonPath("$.domain").value("localhost"));
    }

    @Test
    public void testGetUnknownAccount() throws Exception {
        SecurityContextHolder.clearContext();

        restAccountMock.perform(get("/tatami/rest/account/profile")
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isInternalServerError());//----------------------

        TestUtil.createAdminSecurityContext();
    }

    @Test
    @Transactional
    public void testRegisterValid() throws Exception {
        UserDTO u = new UserDTO(
            "joe",                  // username
            "password",             // password
            "avatar",               // avatar
            "Joe",                  // firstName
            "Shmoe",                // lastName
            "joe@example.com",      // e-mail
            true,                   // activated
            "en",                   // langKey
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.USER)),   //Authorities
            "Developer",            // Job Title
            "This is my job description",   //Job Description
            "123-456-7890",          // Phone Number
            false,                  // mentionEmail
            "testrssuid",            // rssUid
            false,                  // weeklyDigest
            false,                   // dailyDigest
            "ippon.fr",              // domain
            0,                       // statusCount
            0,                       // followersCount
            0,                        // friendsCount
            false                     // isAdmin
        );

        restAccountMock.perform(
            post("/tatami/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(u)))
            .andExpect(status().isCreated());

        Optional<User> user = userRepository.findOneByEmail("joe@example.com");
        assertThat(user.isPresent()).isTrue();
    }

    @Test
    @Transactional
    public void testRegisterInvalidLogin() throws Exception {
        UserDTO u = new UserDTO(
            "funky-log!n",              // username <-- invalid
            "password",             // password
            "avatar",               // avatar
            "Funky",                // firstName
            "One",                  // lastName
            "funky@example.com",    // e-mail
            true,                   // activated
            "en",                   // langKey
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.USER)),
            "Developer",            // Job Title
            "This is my job description",   //Job Description
            "123-456-7890",         // Phone Number
            false,                  // mentionEmail
            "testrssuid",            // rssUid
            false,                  // weeklyDigest
            false,                   // dailyDigest
            "ippon.fr",              // domain
            0,                       // statusCount
            0,                       // followersCount
            0,                        // friendsCount
            false                     // isAdmin
        );

        restAccountMock.perform(
            post("/tatami/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(u)))
            .andExpect(status().isBadRequest());

        Optional<User> user = userRepository.findOneByEmail("funky@example.com");
        assertThat(user.isPresent()).isFalse();
    }

    @Test
    @Transactional
    public void testRegisterInvalidEmail() throws Exception {
        UserDTO u = new UserDTO(
            "username",         // username
            "password",         // password
            "avatar",           // avatar
            "Bob",              // firstName
            "Green",            // lastName
            "invalid",          // e-mail <-- invalid
            true,               // activated
            "en",               // langKey
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.USER)),
            "Developer",            // Job Title
            "This is my Job description",      //Job Description
            "123-456-7890",        // Phone Number
            false,                  // mentionEmail
            "testrssuid",            // rssUid
            false,                  // weeklyDigest
            false,                   // dailyDigest
            "ippon.fr",              // domain
            0,                       // statusCount
            0,                       // followersCount
            0,                        // friendsCount
            false                     // isAdmin
        );

        restAccountMock.perform(
            post("/tatami/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(u)))
            .andExpect(status().isBadRequest());

        Optional<User> user = userRepository.findOneByEmail("invalid");
        assertThat(user.isPresent()).isFalse();
    }

    @Test
    @Transactional
    // Duplicate usernames should be allowed:
    public void testRegisterDuplicateLogin() throws Exception {
        // Good
        UserDTO u = new UserDTO(
            "alice",                // username
            "password",             // password
            "avatar",               // avatar
            "Alice",                // firstName
            "Something",            // lastName
            "alice@example.com",    // e-mail
            true,                   // activated
            "en",                   // langKey
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.USER)),
            "Developer",            // Job Title
            "This is my Job description",      //Job Description
            "123-456-7890",         // Phone Number
            false,                  // mentionEmail
            "testrssuid",            // rssUid
            false,                  // weeklyDigest
            false,                   // dailyDigest
            "ippon.fr",              // domain
            0,                       // statusCount
            0,                       // followersCount
            0,                        // friendsCount
            false                     // isAdmin
        );

        // Duplicate username, different e-mail
        UserDTO dup = new UserDTO(u.getUsername(), u.getPassword(), u.getAvatar(), u.getFirstName(), u.getLastName(),
            "alicejr@example.com", true, u.getLangKey(), u.getAuthorities(), u.getJobTitle(), u.getJobDescription(), u.getPhoneNumber(),
            u.isMentionEmail(), u.getRssUid(), u.isWeeklyDigest(),
            u.isDailyDigest(), u.getDomain(), u.getStatusCount(), u.getFollowersCount(), u.getFriendsCount(), u.getIsAdmin());

        // Good user
        restAccountMock.perform(
            post("/tatami/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(u)))
            .andExpect(status().isCreated());

        // Duplicate username
        restAccountMock.perform(
            post("/tatami/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(dup)))
            .andExpect(status().isCreated());

        // Duplicate usernames should be allowed:
        Optional<User> userDup = userRepository.findOneByEmail("alicejr@example.com");
        assertThat(userDup.isPresent()).isTrue();
    }

    @Test
    @Transactional
    public void testRegisterDuplicateEmail() throws Exception {
        // Good
        UserDTO u = new UserDTO(
            "john",             // username
            "password",             // password
            "avatar",               // avatar
            "John",                 // firstName
            "Doe",                  // lastName
            "john@example.com",     // e-mail
            true,                   // activated
            "en",                   // langKey
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.USER)),
            "Developer",            // Job Title
            "This is my Job description",      //Job Description
            "123-456-7890",         // Phone Number
            false,                  // mentionEmail
            "testrssuid",            // rssUid
            false,                  // weeklyDigest
            false,                   // dailyDigest
            "ippon.fr",              // domain
            0,                       // statusCount
            0,                       // followersCount
            0,                        // friendsCount
            false                     // isAdmin
        );

        // Duplicate e-mail, different username
        UserDTO dup = new UserDTO("johnjr", u.getPassword(), u.getAvatar(), u.getFirstName(), u.getLastName(),
            u.getEmail(), true, u.getLangKey(), u.getAuthorities(), u.getJobTitle(), u.getJobDescription(), u.getPhoneNumber(),
            u.isMentionEmail(), u.getRssUid(), u.isWeeklyDigest(),
            u.isDailyDigest(), u.getDomain(), u.getStatusCount(), u.getFollowersCount(), u.getFriendsCount(), u.getIsAdmin());

        // Good user
        restAccountMock.perform(
            post("/tatami/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(u)))
            .andExpect(status().isCreated());

        // Duplicate e-mail
        restAccountMock.perform(
            post("/tatami/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(dup)))
            .andExpect(status().is4xxClientError());

        Optional<User> user = userRepository.findOneByEmail("john@example.com");
        if (user.isPresent()) {
            assertThat(user.get().getUsername().contains("john"));
        } else {
            Assert.fail();
        }
    }

    @Test
    @Transactional
    public void testRegisterAdminIsIgnored() throws Exception {
        UserDTO u = new UserDTO(
            "badguy",             // username
            "password",             // password
            "avatar",               // avatar
            "Bad",                  // firstName
            "Guy",                  // lastName
            "badguy@example.com",   // e-mail
            true,                   // activated
            "en",                   // langKey
            new HashSet<>(Collections.singletonList(AuthoritiesConstants.ADMIN)), // <-- only admin should be able to do that
            "Developer",            // Job Title
            "This is my Job description",      //Job Description
            "123-456-7890",         // Phone Number
            false,                  // mentionEmail
            "testrssuid",            // rssUid
            false,                  // weeklyDigest
            false,                  // dailyDigest
            "ippon.fr",              // domain
            0,                       // statusCount
            0,                       // followersCount
            0,                        // friendsCount
            true                     // isAdmin
        );

        restAccountMock.perform(
            post("/tatami/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(u)))
            .andExpect(status().isCreated());

        Optional<User> userDup = userRepository.findOneByEmail("badguy@example.com");
        if (userDup.isPresent()) {
            assertThat(userDup.get().getAuthorities()).containsExactly(AuthoritiesConstants.USER);
        } else {
            Assert.fail();
        }
    }
}
