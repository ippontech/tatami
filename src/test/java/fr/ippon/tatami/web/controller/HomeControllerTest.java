package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import org.junit.Before;
import org.junit.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class HomeControllerTest extends AbstractCassandraTatamiTest {

    private MockMvc mockMvc;

    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(new HomeController()).build();
    }

    @Test
    public void testTOSPage() throws Exception {
        mockMvc.perform(get("/tos"))
                .andExpect(status().isOk());
    }
}
