package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserTagRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.StatusUpdateService;
import fr.ippon.tatami.service.TagMembershipService;
import fr.ippon.tatami.service.TimelineService;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.inject.Inject;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class TagControllerTest extends AbstractCassandraTatamiTest {

    @Inject
    private TimelineService timelineService;

    @Inject
    private StatusUpdateService statusUpdateService;

    @Inject
    private TagMembershipService tagMembershipService;

    @Inject
    private UserTagRepository userTagRepository;

    private MockMvc mockMvc;

    private MockMvc timelineMockMvc;

    private static final String username = "timelineUser";

    @Before
    public void setup() {

        TagController tagController = new TagController();
        ReflectionTestUtils.setField(tagController, "timelineService", timelineService);
        ReflectionTestUtils.setField(tagController, "tagMembershipService", tagMembershipService);
        ReflectionTestUtils.setField(tagController, "userTagRepository", userTagRepository);

        User authenticateUser = constructAUser(username + "@ippon.fr");
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(tagController, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(timelineService, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(statusUpdateService, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(tagMembershipService, "authenticationService", mockAuthenticationService);
        this.mockMvc = MockMvcBuilders.standaloneSetup(tagController).build();

        TimelineController timelineController = new TimelineController();
        ReflectionTestUtils.setField(timelineController, "timelineService", timelineService);
        ReflectionTestUtils.setField(timelineController, "statusUpdateService", statusUpdateService);
        this.timelineMockMvc = MockMvcBuilders.standaloneSetup(timelineController).build();
    }

    @Test
    public void testTagline() throws Exception {
        mockMvc.perform(get("/rest/tags/testTag/tag_timeline")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.[0]").doesNotExist());

        timelineMockMvc.perform(post("/rest/statuses/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"content\":\"Test status with a tag #testTag\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/rest/tags/testTag/tag_timeline")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.[0].content").value("Test status with a tag #testTag"));

    }

    @Test
    public void testTagMembership() throws Exception {

        mockMvc.perform(get("/rest/tagmemberships/list")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.[0]").doesNotExist());

        mockMvc.perform(post("/rest/tagmemberships/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"testTag\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/rest/tagmemberships/list")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.[0].name").value("testTag"));

        mockMvc.perform(post("/rest/tagmemberships/destroy")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"testTag\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/rest/tagmemberships/list")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.[0]").doesNotExist());
    }
}
