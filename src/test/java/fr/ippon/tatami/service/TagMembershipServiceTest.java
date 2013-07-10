package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.web.rest.dto.Tag;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Inject;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class TagMembershipServiceTest extends AbstractCassandraTatamiTest {

    @Inject
    public UserService userService;

    @Inject
    public TagMembershipService tagMembershipService;

    @Test
    public void shouldFollowTag() {
        mockAuthentication("uuser@ippon.fr");

        Tag tag = new Tag();
        tag.setName("test");
        assertTrue(tagMembershipService.followTag(tag));
        assertTrue(tagMembershipService.unfollowTag(tag));
    }

    @Test
    public void shouldNotFollowTagTwice() {
        mockAuthentication("uuser@ippon.fr");

        Tag tag = new Tag();
        tag.setName("test");
        assertTrue(tagMembershipService.followTag(tag));
        assertFalse(tagMembershipService.followTag(tag));
        assertTrue(tagMembershipService.unfollowTag(tag));
    }

    @Test
    public void shouldNotUnfollowUnknownTag() {
        mockAuthentication("uuser@ippon.fr");

        Tag tag = new Tag();
        tag.setName("test");
        assertFalse(tagMembershipService.unfollowTag(tag));
    }

    private void mockAuthentication(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(tagMembershipService, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(userService, "authenticationService", mockAuthenticationService);
    }
}