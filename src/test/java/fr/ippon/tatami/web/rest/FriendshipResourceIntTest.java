package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.Application;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.service.FriendshipService;
import fr.ippon.tatami.service.UserService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.inject.Inject;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebIntegrationTest
public class FriendshipResourceIntTest {

    @Inject
    private FriendshipService friendshipService;

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserService userService;

    private MockMvc restFriendshipMockMvc;

    @Before
    public void setup() {
        FriendshipResource friendshipResource = new FriendshipResource();
        ReflectionTestUtils.setField(friendshipResource, "userRepository", userRepository);
        ReflectionTestUtils.setField(friendshipResource, "userService", userService);
        ReflectionTestUtils.setField(friendshipResource, "friendshipService", friendshipService);
        this.restFriendshipMockMvc = MockMvcBuilders.standaloneSetup(friendshipResource).build();
    }


    @Test
    public void unknownUserTest() throws Exception {
        //getFriends of a non existing user
        restFriendshipMockMvc
            .perform(get("/tatami/rest/users/nobody@localhost/friends")
                .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isNotFound());

        //getFollowers of a non existing user
        restFriendshipMockMvc
            .perform(get("/tatami/rest/users/nobody@localhost/followers")
                .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isNotFound());

        //add a non-existing friend
        restFriendshipMockMvc.perform(patch("/tatami/rest/users/nobody@localhost")
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isNotFound());
    }


    @Test
    public void testGetAndAddFriendWorkflow() throws Exception {

        //getFriends of admin@localhost and check user@localhost is not a friend
        restFriendshipMockMvc.perform(get("/tatami/rest/users/admin@localhost/friends"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[?(@['email']=='user@localhost')]").isEmpty());

        //getFollowers of user@localhost and check admin@localhost is not a follower
        restFriendshipMockMvc.perform(get("/tatami/rest/users/user@localhost/followers"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[?(@['email']=='admin@localhost')]").isEmpty());

        //add user@localhost as a friend of admin
        restFriendshipMockMvc.perform(patch("/tatami/rest/users/user@localhost")
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(jsonPath("$.email").value("user@localhost"));

        //check if user was added to admin's friends
        restFriendshipMockMvc.perform(get("/tatami/rest/users/admin@localhost/friends"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[?(@['email']=='user@localhost')]").isNotEmpty());

        //check if admin was added as follower of user
        restFriendshipMockMvc.perform(get("/tatami/rest/users/user@localhost/followers"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[?(@['email']=='admin@localhost')]").isNotEmpty());

        //remove user from admin@localhost's friends
        restFriendshipMockMvc.perform(patch("/tatami/rest/users/user@localhost")
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(jsonPath("$.email").value("user@localhost"));

        //check the removal in admin's friends
        restFriendshipMockMvc.perform(get("/tatami/rest/users/admin@localhost/friends"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[?(@['email']=='user@localhost')]").isEmpty());

        //check the removal in user's followers
        restFriendshipMockMvc.perform(get("/tatami/rest/users/user@localhost/followers"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[?(@['email']=='admin@localhost')]").isEmpty());
    }
}
