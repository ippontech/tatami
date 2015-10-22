package fr.ippon.tatami.web.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.dto.UserGroupDTO;
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
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class GroupControllerTest extends AbstractCassandraTatamiTest {

    private MockMvc mockMvc;

    @Inject
    private GroupService groupService;

    @Inject
    private UserService userService;

    @Before
    public void setup() {

        GroupController groupController = new GroupController();

        User authenticateUser = constructAUser("userWhoHasGroup@ippon.fr");
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(groupController, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(groupController, "groupService", groupService);
        ReflectionTestUtils.setField(groupController, "userService", userService);

        ReflectionTestUtils.setField(groupService, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(userService, "authenticationService", mockAuthenticationService);

        this.mockMvc = MockMvcBuilders.standaloneSetup(groupController).build();
    }

    @Test
    public void testCreateAndArchiveGroup() throws Exception {

        // Test group creation
        mockMvc.perform(post("/rest/groups")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"publicGroup\":false,\"archivedGroup\":false,\"name\":\"Test group\"," +
                        "\"description\":\"This is a test group\"}"))
                .andExpect(status().isOk());

        String groupsAsJson = mockMvc.perform(get("/rest/groupmemberships/lookup")
                .param("screen_name", "userWhoHasGroup")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.[0].name").value("Test group"))
                .andReturn().getResponse().getContentAsString();

        Collection<Group> groups =
                new ObjectMapper().readValue(groupsAsJson, new TypeReference<List<Group>>() {

                });

        assertEquals(1, groups.size());

        String groupId = groups.iterator().next().getGroupId();

        mockMvc.perform(get("/rest/groups/" + groupId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.name").value("Test group"));

        // Test group update

        mockMvc.perform(put("/rest/groups/" + groupId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"publicGroup\":false,\"archivedGroup\":false,\"name\":\"Updated test group\"," +
                        "\"description\":\"This is a test group\"}")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mockMvc.perform(get("/rest/groups/" + groupId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.name").value("Updated test group"));

        // Test adding and removing a user
        assertEquals(1, groupSize(groupId));

        mockMvc.perform(put("/rest/groups/" + groupId + "/members/uuser")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        assertEquals(2, groupSize(groupId));

        mockMvc.perform(delete("/rest/groups/" + groupId + "/members/uuser")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        assertEquals(1, groupSize(groupId));

        // Test group archive

        mockMvc.perform(put("/rest/groups/" + groupId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"publicGroup\":false,\"archivedGroup\":true,\"name\":\"Updated test group\"," +
                        "\"description\":\"This is a test group\"}")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        groupsAsJson = mockMvc.perform(get("/rest/groupmemberships/lookup")
                .param("screen_name", "userWhoHasGroup")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andReturn().getResponse().getContentAsString();

        groups = new ObjectMapper().readValue(groupsAsJson, new TypeReference<List<Group>>() {

        });

        assertTrue(groups.iterator().next().isArchivedGroup());
    }

    private int groupSize(String groupId) throws Exception {
        String usersAsJson = mockMvc.perform(get("/rest/groups/" + groupId + "/members/")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.[0].lastName").value("WhoHasGroup"))
                .andExpect(jsonPath("$.[0].isMember").value(true))
                .andReturn().getResponse().getContentAsString();

        Collection<UserGroupDTO> userGroupDTOs =
                new ObjectMapper().readValue(usersAsJson, new TypeReference<List<UserGroupDTO>>() {

                });

        return userGroupDTOs.size();
    }
}
