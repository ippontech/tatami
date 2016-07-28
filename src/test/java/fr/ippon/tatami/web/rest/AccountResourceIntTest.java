package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.AbstractCassandraTest;
import fr.ippon.tatami.Application;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.AuthoritiesConstants;
import fr.ippon.tatami.service.MailService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.web.rest.dto.UserDTO;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
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
@WebAppConfiguration
@IntegrationTest
public class AccountResourceIntTest extends AbstractCassandraTest {

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserService userService;

    @Mock
    private UserService mockUserService;

    @Mock
    private MailService mockMailService;

    private MockMvc restUserMockMvc;

    private MockMvc restMvc;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        doNothing().when(mockMailService).sendActivationEmail((User) anyObject(), anyString());

        AccountResource accountResource = new AccountResource();
        ReflectionTestUtils.setField(accountResource, "userRepository", userRepository);
        ReflectionTestUtils.setField(accountResource, "userService", userService);
        ReflectionTestUtils.setField(accountResource, "mailService", mockMailService);

        AccountResource accountUserMockResource = new AccountResource();
        ReflectionTestUtils.setField(accountUserMockResource, "userRepository", userRepository);
        ReflectionTestUtils.setField(accountUserMockResource, "userService", mockUserService);
        ReflectionTestUtils.setField(accountUserMockResource, "mailService", mockMailService);

        this.restMvc = MockMvcBuilders.standaloneSetup(accountResource).build();
        this.restUserMockMvc = MockMvcBuilders.standaloneSetup(accountUserMockResource).build();
    }

    @Test
    public void testNonAuthenticatedUser() throws Exception {
        restUserMockMvc.perform(get("/tatami/authenticate")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(""));
    }

    @Test
    public void testAuthenticatedUser() throws Exception {
        restUserMockMvc.perform(get("/tatami/authenticate")
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
        Set<String> authorities = new HashSet<>();
        authorities.add(AuthoritiesConstants.ADMIN);

        User user = new User();
        user.setUsername("test");
        user.setFirstName("john");
        user.setLastName("doe");
        user.setEmail("john.doe@jhipter.com");
        user.setAuthorities(authorities);
        user.setJobTitle("developer");
        user.setPhoneNumber("123-456-7890");
        user.setMentionEmail(false);
        user.setRssUid("testrssuid");
        user.setWeeklyDigest(false);
        user.setDailyDigest(false);
        user.setDomain("ippon.fr");
        when(mockUserService.getCurrentUser()).thenReturn(Optional.of(user));

        restUserMockMvc.perform(get("/tatami/rest/account/profile")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())//----------------------
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value("test"))
                .andExpect(jsonPath("$.firstName").value("john"))
                .andExpect(jsonPath("$.lastName").value("doe"))
                .andExpect(jsonPath("$.email").value("john.doe@jhipter.com"))
                .andExpect(jsonPath("$.authorities").value(AuthoritiesConstants.ADMIN))
                .andExpect(jsonPath("$.jobTitle").value("developer"))
                .andExpect(jsonPath("$.phoneNumber").value("123-456-7890"))
                .andExpect(jsonPath("$.mentionEmail").value(false))
                .andExpect(jsonPath("$.rssUid").value("testrssuid"))
                .andExpect(jsonPath("$.weeklyDigest").value(false))
                .andExpect(jsonPath("$.dailyDigest").value(false))
                .andExpect(jsonPath("$.domain").value("ippon.fr"));
    }

    @Test
    public void testGetUnknownAccount() throws Exception {
        when(mockUserService.getCurrentUser()).thenReturn(Optional.empty());

        restUserMockMvc.perform(get("/tatami/rest/account/profile")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());//----------------------
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
            new HashSet<>(Arrays.asList(AuthoritiesConstants.USER)),   //Authorities
            "Developer",            // Job Title
            "123-456-7890",          // Phone Number
            false,                  // mentionEmail
            "testrssuid",            // rssUid
            false,                  // weeklyDigest
            false,                   // dailyDigest
            "ippon.fr",              // domain
            0,                       // statusCount
            0,                       // followersCount
            0                        // friendsCount
        );

        restMvc.perform(
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
            new HashSet<>(Arrays.asList(AuthoritiesConstants.USER)),
            "Developer",            // Job Title
            "123-456-7890",         // Phone Number
            false,                  // mentionEmail
            "testrssuid",            // rssUid
            false,                  // weeklyDigest
            false,                   // dailyDigest
            "ippon.fr",              // domain
            0,                       // statusCount
            0,                       // followersCount
            0                        // friendsCount
        );

        restUserMockMvc.perform(
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
            new HashSet<>(Arrays.asList(AuthoritiesConstants.USER)),
            "Developer",            // Job Title
            "123-456-7890",        // Phone Number
            false,                  // mentionEmail
            "testrssuid",            // rssUid
            false,                  // weeklyDigest
            false,                   // dailyDigest
            "ippon.fr",              // domain
            0,                       // statusCount
            0,                       // followersCount
            0                        // friendsCount
        );

        restUserMockMvc.perform(
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
            new HashSet<>(Arrays.asList(AuthoritiesConstants.USER)),
            "Developer",            // Job Title
            "123-456-7890",         // Phone Number
            false,                  // mentionEmail
            "testrssuid",            // rssUid
            false,                  // weeklyDigest
            false,                   // dailyDigest
            "ippon.fr",              // domain
            0,                       // statusCount
            0,                       // followersCount
            0                        // friendsCount
        );

        // Duplicate username, different e-mail
        UserDTO dup = new UserDTO(u.getUsername(), u.getPassword(), u.getAvatar(), u.getFirstName(), u.getLastName(),
            "alicejr@example.com", true, u.getLangKey(), u.getAuthorities(), u.getJobTitle(), u.getPhoneNumber(),
            u.isMentionEmail(), u.getRssUid(), u.isWeeklyDigest(),
            u.isDailyDigest(), u.getDomain(), u.getStatusCount(), u.getFollowerscount(), u.getFriendsCount());

        // Good user
        restMvc.perform(
            post("/tatami/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(u)))
            .andExpect(status().isCreated());

        // Duplicate username
        restMvc.perform(
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
            new HashSet<>(Arrays.asList(AuthoritiesConstants.USER)),
            "Developer",            // Job Title
            "123-456-7890",         // Phone Number
            false,                  // mentionEmail
            "testrssuid",            // rssUid
            false,                  // weeklyDigest
            false,                   // dailyDigest
            "ippon.fr",              // domain
            0,                       // statusCount
            0,                       // followersCount
            0                        // friendsCount
        );

        // Duplicate e-mail, different username
        UserDTO dup = new UserDTO("johnjr", u.getPassword(), u.getAvatar(), u.getFirstName(), u.getLastName(),
            u.getEmail(), true, u.getLangKey(), u.getAuthorities(), u.getJobTitle(), u.getPhoneNumber(),
            u.isMentionEmail(), u.getRssUid(), u.isWeeklyDigest(),
            u.isDailyDigest(), u.getDomain(), u.getStatusCount(), u.getFollowerscount(), u.getFriendsCount());

        // Good user
        restMvc.perform(
            post("/tatami/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(u)))
            .andExpect(status().isCreated());

        // Duplicate e-mail
        restMvc.perform(
            post("/tatami/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(dup)))
            .andExpect(status().is4xxClientError());

        Optional<User> user = userRepository.findOneByEmail("john@example.com");
        assertThat(user.get().getUsername().contains("john"));
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
            new HashSet<>(Arrays.asList(AuthoritiesConstants.ADMIN)), // <-- only admin should be able to do that
            "Developer",            // Job Title
            "123-456-7890",         // Phone Number
            false,                  // mentionEmail
            "testrssuid",            // rssUid
            false,                  // weeklyDigest
            false,                  // dailyDigest
            "ippon.fr",              // domain
            0,                       // statusCount
            0,                       // followersCount
            0                        // friendsCount
        );

        restMvc.perform(
            post("/tatami/register")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(u)))
            .andExpect(status().isCreated());

        Optional<User> userDup = userRepository.findOneByEmail("badguy@example.com");
        assertThat(userDup.isPresent()).isTrue();
        assertThat(userDup.get().getAuthorities()).hasSize(1)
            .containsExactly(AuthoritiesConstants.USER);
    }
}
