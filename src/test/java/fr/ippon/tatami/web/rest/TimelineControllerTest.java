package fr.ippon.tatami.web.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.StatusUpdateService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.dto.StatusDTO;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.inject.Inject;
import java.util.Collection;
import java.util.List;

import static org.junit.Assert.assertEquals;
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

    private static final String username = "timelineUser";

    @Before
    public void setup() {

        TimelineController timelineController = new TimelineController();
        ReflectionTestUtils.setField(timelineController, "timelineService", timelineService);
        ReflectionTestUtils.setField(timelineController, "statusUpdateService", statusUpdateService);
        ReflectionTestUtils.setField(timelineController, "groupService", groupService);

        User authenticateUser = constructAUser(username + "@ippon.fr");
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(timelineController, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(timelineService, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(statusUpdateService, "authenticationService", mockAuthenticationService);
        this.mockMvc = MockMvcBuilders.standaloneSetup(timelineController).build();
    }

    @Test
    public void testStatusUpdate() throws Exception {
        mockMvc.perform(post("/rest/statuses/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"content\":\"Test status with Spring TestContext\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/rest/statuses/home_timeline")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.[0].content").value("Test status with Spring TestContext"));

        mockMvc.perform(get("/rest/statuses/" + username + "/timeline")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.[0].content").value("Test status with Spring TestContext"));
    }

    @Test
    public void testStatusReply() throws Exception {
        //Create status
        mockMvc.perform(post("/rest/statuses/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"content\":\"Test discussion\"}"))
                .andExpect(status().isOk());

        String statusAsJson = mockMvc.perform(get("/rest/statuses/home_timeline")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andReturn().getResponse().getContentAsString();

        Collection<StatusDTO> statusDTOs = new ObjectMapper().readValue(statusAsJson,
                new TypeReference<List<StatusDTO>>() {

                });

        String statusId = statusDTOs.iterator().next().getStatusId();

        mockMvc.perform(post("/rest/statuses/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"replyTo\":\"" + statusId + "\", \"content\":\"Reply discussion\"}"))
                .andExpect(status().isOk());

        String replyAsJson = mockMvc.perform(get("/rest/statuses/home_timeline")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andReturn().getResponse().getContentAsString();

        statusDTOs = new ObjectMapper().readValue(replyAsJson,
                new TypeReference<List<StatusDTO>>() {

                });

        StatusDTO statusDTO = statusDTOs.iterator().next();
        assertEquals("Reply discussion", statusDTO.getContent());
        assertEquals(statusId, statusDTO.getReplyTo());
    }
}
