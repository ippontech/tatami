package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.StatusUpdateService;
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

public class TimelineControllerTest extends AbstractCassandraTatamiTest {

    @Inject
    private TimelineService timelineService;

    @Inject
    private StatusUpdateService statusUpdateService;

    @Inject
    private GroupService groupService;

    private MockMvc mockMvc;

    @Before
    public void setup() {

        TimelineController timelineController = new TimelineController();
        ReflectionTestUtils.setField(timelineController, "timelineService", timelineService);
        ReflectionTestUtils.setField(timelineController, "statusUpdateService", statusUpdateService);
        ReflectionTestUtils.setField(timelineController, "groupService", groupService);

        User authenticateUser = constructAUser("timelineUser@ippon.fr");
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(timelineController, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(timelineService, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(statusUpdateService, "authenticationService", mockAuthenticationService);
        this.mockMvc = MockMvcBuilders.standaloneSetup(timelineController).build();
    }

    @Test
    public void testStatusUpdate() throws Exception {
        mockMvc.perform(post("/rest/statuses/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"content\":\"Test status with Spring TestContext\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/rest/statuses/home_timeline")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.[0].content").value("Test status with Spring TestContext"));
    }
}
