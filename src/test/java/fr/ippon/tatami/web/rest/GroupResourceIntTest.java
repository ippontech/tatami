package fr.ippon.tatami.web.rest;


import fr.ippon.tatami.Application;
import fr.ippon.tatami.repository.GroupRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.service.*;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.inject.Inject;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebIntegrationTest
public class GroupResourceIntTest {

    @Inject
    private TimelineService timelineService;

    @Inject
    private GroupService groupService;

    @Inject
    private GroupRepository groupRepository;

    @Inject
    private SuggestionService suggestionService;

    @Inject
    private UserRepository userRepository;

    private MockMvc restGroupMockMvc;

    @Before
    public void setup() {
        GroupResource groupResource = new GroupResource();
        ReflectionTestUtils.setField(groupResource, "timelineService", timelineService);
        ReflectionTestUtils.setField(groupResource, "groupService", groupService);
        ReflectionTestUtils.setField(groupResource, "groupRepository", groupRepository);
        ReflectionTestUtils.setField(groupResource, "suggestionService", suggestionService);
        ReflectionTestUtils.setField(groupResource, "userRepository", userRepository);
        this.restGroupMockMvc = MockMvcBuilders.standaloneSetup(groupResource).build();
    }


    @Test
    public void testUnknownGroup() throws Exception {
        JSONObject group = new JSONObject();
        group.put("name", "");
        group.put("description", "This is an invalid group");
        group.put("publicGroup", true);
        group.put("archivedGroup",false);

        restGroupMockMvc.perform(post("/tatami/rest/groups")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(group.toString()))
            .andExpect(status().isInternalServerError());

    }

    @Test
    public void testGroupByUnknownuser() throws Exception{
        restGroupMockMvc.perform(get("/tatami/rest/groupmemberships/lookup")
            .param("screen_name","nobody@localhost")
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk()); // Not satisfying, Java code should set the status to not found..

        restGroupMockMvc.perform(get("/tatami/rest/admin/groups")
            .param("screen_name","nobody@localhost")
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk()); // Not satisfying, Java code should set the status to not found..
    }


    @Test
    public void testNormalGroupWorkflow() throws Exception {
        JSONObject group = new JSONObject();
        group.put("name", "my group");
        group.put("description", "This is my first group");
        group.put("publicGroup", true);
        group.put("archivedGroup",false);

        restGroupMockMvc.perform(get("/tatami/rest/groups")
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[?(@['name']=='my group')]").isEmpty());

        restGroupMockMvc.perform(get("/tatami/rest/groupmemberships/lookup")
            .param("screen_name","admin@localhost")
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[?(@['name']=='my group')]").isEmpty());

        restGroupMockMvc.perform(get("/tatami/rest/admin/groups")
            .param("screen_name","admin@localhost")
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[?(@['name']=='my group')]").isEmpty());

        restGroupMockMvc.perform(post("/tatami/rest/groups")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(group.toString()))
            .andExpect(status().isOk());

        restGroupMockMvc.perform(get("/tatami/rest/groups")
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[?(@['name']=='my group')]").isNotEmpty());

        restGroupMockMvc.perform(get("/tatami/rest/groupmemberships/lookup")
                .param("screen_name","admin@localhost")
                .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[?(@['name']=='my group')]").isNotEmpty());

        restGroupMockMvc.perform(get("/tatami/rest/admin/groups")
            .param("screen_name","admin@localhost")
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[?(@['name']=='my group')]").isNotEmpty());

    }


}

