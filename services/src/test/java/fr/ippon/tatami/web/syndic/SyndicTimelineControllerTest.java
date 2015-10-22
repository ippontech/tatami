//package fr.ippon.tatami.web.syndic;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import fr.ippon.tatami.AbstractCassandraTatamiTest;
//import fr.ippon.tatami.domain.User;
//import fr.ippon.tatami.security.AuthenticationService;
//import fr.ippon.tatami.service.StatusUpdateService;
//import fr.ippon.tatami.service.TimelineService;
//import fr.ippon.tatami.service.UserService;
//import fr.ippon.tatami.service.dto.StatusDTO;
//import fr.ippon.tatami.web.rest.AccountController;
//import fr.ippon.tatami.web.rest.TimelineController;
//import fr.ippon.tatami.web.rest.dto.Preferences;
//import org.apache.commons.lang.CharEncoding;
//import org.junit.Before;
//import org.junit.Test;
//import org.springframework.context.i18n.LocaleContextHolder;
//import org.springframework.context.support.ReloadableResourceBundleMessageSource;
//import org.springframework.core.env.Environment;
//import org.springframework.http.MediaType;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.test.util.ReflectionTestUtils;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//import org.springframework.web.servlet.ModelAndView;
//
//import javax.inject.Inject;
//import java.util.ArrayList;
//import java.util.Collection;
//import java.util.Locale;
//
//import static org.junit.Assert.assertEquals;
//import static org.mockito.Mockito.mock;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//public class SyndicTimelineControllerTest extends AbstractCassandraTatamiTest {
//
//    @Inject
//    private TimelineService timelineService;
//
//    @Inject
//    private StatusUpdateService statusUpdateService;
//
//    @Inject
//    private UserService userService;
//
//    @Inject
//    Environment env;
//
//    private MockMvc mockMvc;
//
//    private MockMvc timelineMockMvc;
//
//    private MockMvc accountMockMvc;
//
//    private static final String username = "timelineUser";
//
//    @Before
//    public void setup() {
//
//        TimelineController timelineController = new TimelineController();
//        ReflectionTestUtils.setField(timelineController, "timelineService", timelineService);
//        ReflectionTestUtils.setField(timelineController, "statusUpdateService", statusUpdateService);
//
//        User authenticateUser = constructAUser(username + "@ippon.fr");
//        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
//        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
//        ReflectionTestUtils.setField(timelineController, "authenticationService", mockAuthenticationService);
//        ReflectionTestUtils.setField(userService, "authenticationService", mockAuthenticationService);
//        ReflectionTestUtils.setField(timelineService, "authenticationService", mockAuthenticationService);
//        ReflectionTestUtils.setField(statusUpdateService, "authenticationService", mockAuthenticationService);
//        this.timelineMockMvc = MockMvcBuilders.standaloneSetup(timelineController).build();
//
//        AccountController accountController = new AccountController();
//        ReflectionTestUtils.setField(accountController, "userService", userService);
//        ReflectionTestUtils.setField(accountController, "env", env);
//        ReflectionTestUtils.setField(accountController, "authenticationService", mockAuthenticationService);
//        this.accountMockMvc = MockMvcBuilders.standaloneSetup(accountController).build();
//
//        SyndicTimelineController syndicTimelineController = new SyndicTimelineController();
//        ReflectionTestUtils.setField(syndicTimelineController, "timelineService", timelineService);
//        ReflectionTestUtils.setField(syndicTimelineController, "userService", userService);
//
//        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
//        messageSource.setBasename("file:src/main/webapp/WEB-INF/messages/messages");
//        messageSource.setDefaultEncoding(CharEncoding.UTF_8);
//        ReflectionTestUtils.setField(syndicTimelineController, "messageSource", messageSource);
//        this.mockMvc = MockMvcBuilders.standaloneSetup(syndicTimelineController).build();
//    }
//
//    @Test
//    @SuppressWarnings("unchecked")
//    public void testStatusUpdate() throws Exception {
//        LocaleContextHolder.setLocale(Locale.US);
//
//        // Post content
//        timelineMockMvc.perform(post("/rest/statuses/")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"content\":\"Test status for RSS syndication\"}"))
//                .andExpect(status().isOk());
//
//        // Get a RSS stream that is not correct
//
//        mockMvc.perform(get("/syndic/12345"))
//                .andExpect(status().isNotFound());
//
//        // Enable RSS for this user
//        org.springframework.security.core.userdetails.User userDetails =
//                new org.springframework.security.core.userdetails.User(username, "", new ArrayList<GrantedAuthority>());
//
//        Authentication authentication =
//                new UsernamePasswordAuthenticationToken(userDetails,
//                        userDetails.getPassword(),
//                        userDetails.getAuthorities());
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//        accountMockMvc.perform(post("/rest/account/preferences")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"mentionEmail\":true," +
//                        "\"weeklyDigest\":false," +
//                        "\"dailyDigest\":false," +
//                        "\"rssUidActive\":true," +
//                        "\"rssUid\":\"\"}"))
//                .andExpect(status().isOk());
//
//        //Get RSS ID
//        String preferencesAsJson = accountMockMvc.perform(get("/rest/account/preferences")
//                .accept(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType("application/json"))
//                .andExpect(jsonPath("$.rssUidActive").value(true))
//                .andReturn().getResponse().getContentAsString();
//
//        Preferences preferences = new ObjectMapper().readValue(preferencesAsJson, Preferences.class);
//
//        String rssId = preferences.getRssUid();
//
//        ModelAndView result = mockMvc.perform(get("/syndic/" + rssId))
//                .andExpect(status().isOk())
//                .andReturn().getModelAndView();
//
//        Collection<StatusDTO> statuses = (Collection<StatusDTO>) result.getModel().get("feedContent");
//        assertEquals("Test status for RSS syndication", statuses.iterator().next().getContent());
//
//    }
//}
