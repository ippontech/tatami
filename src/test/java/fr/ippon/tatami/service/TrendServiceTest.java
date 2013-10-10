package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.web.rest.dto.Trend;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class TrendServiceTest extends AbstractCassandraTatamiTest {

    @Inject
    public StatusUpdateService statusUpdateService;

    @Inject
    public TrendService trendService;

    @Test
    public void testSearchTags() {
        mockAuthentication("currentuser@domain.com");
        String domain = "domain.com";
        Collection<String> tags = trendService.searchTags(domain, "Te", 1);
        assertEquals(0, tags.size());
        tags = trendService.searchTags(domain, "Test", 1);
        assertEquals(0, tags.size());
        statusUpdateService.postStatus("Message #Test", false, new ArrayList<String>(), null);
        tags = trendService.searchTags(domain, "Te", 1);
        assertEquals(1, tags.size());
        tags = trendService.searchTags(domain, "Test", 1);
        assertEquals(1, tags.size());
    }

    @Test
    public void testCurrentTrends() {
        mockAuthentication("currentuser@domain.com");
        String domain = "domain.com";
        Collection<Trend> trends = trendService.getCurrentTrends(domain);
        for (Trend trend : trends) {
            if (trend.getTag().equals("TheTrend")) {
                fail("#TheTrend shoud not be trending yet");
            }
        }
        for (int i = 0; i < 5; i++) {
            statusUpdateService.postStatus("Trending message " + i + " #Trending", false, new ArrayList<String>(), null);
        }
        trends = trendService.getCurrentTrends(domain);
        boolean foundTrend = false;
        for (Trend trend : trends) {
            if (trend.getTag().equals("Trending")) {
                foundTrend = true;
                assertTrue(trend.isTrendingUp());
            }
        }
        if (!foundTrend) {
            fail("#Trending should have been trending");
        }
        for (int i = 0; i < 7; i++) {
            statusUpdateService.postStatus("New trending message " + i + " #NewTrend", false, new ArrayList<String>(), null);
        }
        trends = trendService.getCurrentTrends(domain);
        foundTrend = false;
        boolean foundNewTrend = false;
        for (Trend trend : trends) {
            if (trend.getTag().equals("Trending")) {
                foundTrend = true;
                assertFalse(trend.isTrendingUp());
            } else if (trend.getTag().equals("NewTrend")) {
                foundNewTrend = true;
                assertTrue(trend.isTrendingUp());
            }
        }
        if (!foundTrend) {
            fail("#Trending should have been trending");
        }
        if (!foundNewTrend) {
            fail("#NewTrend should have been trending");
        }
    }

    @Test
    public void testUserTrends() {
        String login = "currentuser@domain.com";
        mockAuthentication(login);
        Collection<Trend> trends = trendService.getTrendsForUser(login);
        for (Trend trend : trends) {
            if (trend.getTag().equals("MyTrend")) {
                fail("#MyTrend shoud not be trending yet");
            }
        }
        for (int i = 0; i < 5; i++) {
            statusUpdateService.postStatus("User trending message " + i + " #MyTrend", false, new ArrayList<String>(), null);
        }
        trends = trendService.getTrendsForUser(login);
        boolean foundTrend = false;
        for (Trend trend : trends) {
            if (trend.getTag().equals("MyTrend")) {
                foundTrend = true;
                assertTrue(trend.isTrendingUp());
            }
        }
        if (!foundTrend) {
            fail("#MyTrend should have been trending");
        }
    }

    @Test
    public void testPrivateMessagesNotInTrends() {
        String login = "currentuser@domain.com";
        mockAuthentication(login);

        for (int i = 0; i < 5; i++) {
            statusUpdateService.postStatus("@anotheruser private message " + i + " #NoTrend", true, new ArrayList<String>(), null);
        }

        Collection<Trend> trends = trendService.getCurrentTrends("domain.com");
        boolean foundTrend = false;
        for (Trend trend : trends) {
            if (trend.getTag().equals("NoTrend")) {
                foundTrend = true;
            }
        }
        if (foundTrend) {
            fail("#NoTrend should not have been trending");
        }

        trendService.getTrendsForUser(login);
        foundTrend = false;
        for (Trend trend : trends) {
            if (trend.getTag().equals("NoTrend")) {
                foundTrend = true;
            }
        }
        if (foundTrend) {
            fail("#NoTrend should not have been trending");
        }
    }

    private void mockAuthentication(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(statusUpdateService, "authenticationService", mockAuthenticationService);
    }
}