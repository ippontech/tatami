package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.dto.StatusDTO;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class StatusDeletionTest extends AbstractCassandraTatamiTest {

    private static final Logger log = LoggerFactory.getLogger(StatusDeletionTest.class);

    @Inject
    public TimelineService timelineService;

    @Inject
    public StatusUpdateService statusUpdateService;

    @Inject
    public GroupService groupService;

    @Inject
    public UserService userService;

    @Test
    public void deleteOneStatus() throws Exception {
        String login = "userWithStatus@ippon.fr";
        String username = "userWithStatus";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login);
        Collection<StatusDTO> timelineStatuses = timelineService.getTimeline(10, null, null);
        assertEquals(2, timelineStatuses.size());
        Collection<StatusDTO> userlineStatuses = timelineService.getUserline(username, 10, null, null);
        assertEquals(2, userlineStatuses.size());

        String content = "temporary status";
        statusUpdateService.postStatus(content, false, new ArrayList<String>(), null);

        timelineStatuses = timelineService.getTimeline(10, null, null);
        assertEquals(3, timelineStatuses.size());
        StatusDTO temporaryStatus = timelineStatuses.iterator().next();
        assertEquals("temporary status", temporaryStatus.getContent());
        userlineStatuses = timelineService.getUserline(username, 10, null, null);
        assertEquals(3, userlineStatuses.size());

        timelineService.removeStatus(temporaryStatus.getStatusId());
        timelineStatuses = timelineService.getTimeline(10, null, null);
        assertEquals(2, timelineStatuses.size());
        userlineStatuses = timelineService.getUserline(username, 10, null, null);
        assertEquals(2, userlineStatuses.size());
    }

    @Test
    public void deleteManyStatuses() throws Exception {
        String login = "userWithStatus@ippon.fr";
        String username = "userWithStatus";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login);
        Collection<StatusDTO> timelineStatuses = timelineService.getTimeline(10, null, null);
        assertEquals(2, timelineStatuses.size());
        Collection<StatusDTO> userlineStatuses = timelineService.getUserline(username, 10, null, null);
        assertEquals(2, userlineStatuses.size());

        for (int i = 0; i < 10; i++) {
            String content = "temporary status " + i;
            statusUpdateService.postStatus(content, false, new ArrayList<String>(),null);
        }

        timelineStatuses = timelineService.getTimeline(10, null, null);
        assertEquals(10, timelineStatuses.size());
        userlineStatuses = timelineService.getUserline(username, 10, null, null);
        assertEquals(10, userlineStatuses.size());
        Iterator<StatusDTO> iterator = timelineStatuses.iterator();
        for (int i = 9; i >= 0; i--) {
            StatusDTO temporaryStatus = iterator.next();
            assertEquals("temporary status " + i, temporaryStatus.getContent());
            timelineService.removeStatus(temporaryStatus.getStatusId());
        }

        timelineStatuses = timelineService.getTimeline(10, null, null);
        assertEquals(2, timelineStatuses.size());
        userlineStatuses = timelineService.getUserline(username, 10, null, null);
        assertEquals(2, userlineStatuses.size());
    }

    @Test
    public void deleteManyStatusesWithTag() throws Exception {
        String login = "userWithStatus@ippon.fr";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login);
        Collection<StatusDTO> tagStatuses = timelineService.getTagline("ippon", 10, null, null);
        assertEquals(2, tagStatuses.size());

        for (int i = 0; i < 10; i++) {
            String content = "temporary status " + i +  " #ippon";
            statusUpdateService.postStatus(content, false, new ArrayList<String>(),null);
        }

        tagStatuses = timelineService.getTagline("ippon", 10, null, null);
        assertEquals(10, tagStatuses.size());
        Iterator<StatusDTO> iterator = tagStatuses.iterator();
        for (int i = 9; i >= 0; i--) {
            StatusDTO temporaryStatus = iterator.next();
            assertEquals("temporary status " + i + " #ippon", temporaryStatus.getContent());
            timelineService.removeStatus(temporaryStatus.getStatusId());
        }

        tagStatuses = timelineService.getTagline("ippon", 10, null, null);
        assertEquals(2, tagStatuses.size());
    }

    @Test
    public void deleteManyStatusesInAGroup() throws Exception {
        String login = "uuser@ippon.fr";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login);
        User user = userService.getUserByLogin(login);
        int userGroupSize = groupService.getGroupsForUser(user).size();

        String groupName = "Group with messages to delete";
        String groupDescription = "Group description";
        boolean publicGroup = true;
        groupService.createGroup(groupName, groupDescription, publicGroup);
        Collection<Group> groups = groupService.getGroupsForUser(user);
        assertEquals(userGroupSize + 1, groups.size());

        Group group = groups.iterator().next();

        Collection<StatusDTO> groupStatuses = timelineService.getGroupline(group.getGroupId(), 10, null, null);
        assertEquals(0, groupStatuses.size());

        for (int i = 0; i < 12; i++) {
            String content = "temporary status " + i;
            statusUpdateService.postStatusToGroup(content, group, new ArrayList<String>(), "1,2");
        }

        groupStatuses = timelineService.getGroupline(group.getGroupId(), 10, null, null);
        assertEquals(10, groupStatuses.size());
        Iterator<StatusDTO> iterator = groupStatuses.iterator();
        for (int i = 11; i >= 2; i--) {
            StatusDTO temporaryStatus = iterator.next();
            assertEquals("temporary status " + i, temporaryStatus.getContent());
            timelineService.removeStatus(temporaryStatus.getStatusId());
        }

        groupStatuses = timelineService.getGroupline(group.getGroupId(), 10, null, null);
        assertEquals(2, groupStatuses.size());

        // Clean up
        groupService.removeMemberFromGroup(user, group);
        assertEquals(userGroupSize, groupService.getGroupsForUser(user).size());
    }

    @Test
    public void deleteFavoriteStatuses() throws Exception {
        String login = "userWithStatus@ippon.fr";
        mockAuthenticationOnTimelineServiceWithACurrentUser(login);
        Collection<StatusDTO> timelineStatuses = timelineService.getTimeline(10, null, null);
        assertEquals(2, timelineStatuses.size());
        Collection<StatusDTO> favoriteStatuses = timelineService.getFavoritesline();
        assertEquals(0, favoriteStatuses.size());

        for (int i = 0; i < 10; i++) {
            String content = "temporary status " + i +  " #ippon";
            statusUpdateService.postStatus(content, false, new ArrayList<String>(),null);
        }

        timelineStatuses = timelineService.getTimeline(10, null, null);
        assertEquals(10, timelineStatuses.size());
        favoriteStatuses = timelineService.getFavoritesline();
        assertEquals(0, favoriteStatuses.size());

        Iterator<StatusDTO> iterator = timelineStatuses.iterator();
        for (int i = 9; i >= 0; i--) {
            StatusDTO temporaryStatus = iterator.next();
            timelineService.addFavoriteStatus(temporaryStatus.getStatusId());
        }
        favoriteStatuses = timelineService.getFavoritesline();
        assertEquals(10, favoriteStatuses.size());

        iterator = timelineStatuses.iterator();
        for (int i = 9; i >= 0; i--) {
            StatusDTO temporaryStatus = iterator.next();
            assertEquals("temporary status " + i + " #ippon", temporaryStatus.getContent());
            timelineService.removeStatus(temporaryStatus.getStatusId());
        }

        timelineStatuses = timelineService.getTimeline(10, null, null);
        assertEquals(2, timelineStatuses.size());
        favoriteStatuses = timelineService.getFavoritesline();
        assertEquals(0, favoriteStatuses.size());
    }

    @Test
    public void deleteMentionnedStatuses() throws Exception {
        String userWhoMentions = "userWithStatus@ippon.fr";
        mockAuthenticationOnTimelineServiceWithACurrentUser(userWhoMentions);
        Collection<StatusDTO> timelineStatuses = timelineService.getTimeline(10, null, null);
        assertEquals(2, timelineStatuses.size());

        String userWhoIsMentionned = "uuser@ippon.fr";
        mockAuthenticationOnTimelineServiceWithACurrentUser(userWhoIsMentionned);
        Collection<StatusDTO> mentionStatuses = timelineService.getMentionline(10, null, null);
        assertEquals(0, mentionStatuses.size());

        mockAuthenticationOnTimelineServiceWithACurrentUser(userWhoMentions);
        for (int i = 0; i < 10; i++) {
            String content = "Hello @uuser " + i;
            statusUpdateService.postStatus(content, false, new ArrayList<String>(),null);
        }

        timelineStatuses = timelineService.getTimeline(10, null, null);
        assertEquals(10, timelineStatuses.size());

        mockAuthenticationOnTimelineServiceWithACurrentUser(userWhoIsMentionned);
        mentionStatuses = timelineService.getMentionline(10, null, null);
        assertEquals(10, mentionStatuses.size());

        mockAuthenticationOnTimelineServiceWithACurrentUser(userWhoMentions);
        Iterator<StatusDTO> iterator = timelineStatuses.iterator();
        for (int i = 9; i >= 0; i--) {
            StatusDTO temporaryStatus = iterator.next();
            assertEquals("Hello @uuser " + i, temporaryStatus.getContent());
            timelineService.removeStatus(temporaryStatus.getStatusId());
        }

        timelineStatuses = timelineService.getTimeline(10, null, null);
        assertEquals(2, timelineStatuses.size());

        mockAuthenticationOnTimelineServiceWithACurrentUser(userWhoIsMentionned);
        mentionStatuses = timelineService.getMentionline(10, null, null);
        assertEquals(0, mentionStatuses.size());
    }

    private void mockAuthenticationOnTimelineServiceWithACurrentUser(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(timelineService, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(statusUpdateService, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(groupService, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(userService, "authenticationService", mockAuthenticationService);
    }

}