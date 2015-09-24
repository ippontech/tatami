package fr.ippon.tatami.service;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.dto.UserGroupDTO;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Inject;
import java.util.Collection;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class GroupServiceTest extends AbstractCassandraTatamiTest {

    @Inject
    public UserService userService;

    @Inject
    public GroupService groupService;

    @Test
    public void createAndGetGroup() {
        mockAuthentication("uuser@ippon.fr");
        User user = userService.getUserByLogin("uuser@ippon.fr");
        String groupName = "Group name";
        String groupDescription = "Group description";
        boolean publicGroup = true;
        groupService.createGroup(groupName, groupDescription, publicGroup);
        Collection<Group> groups = groupService.getGroupsForUser(user);
        assertEquals(1, groups.size());

        String groupId = groups.iterator().next().getGroupId();

        Group group = groupService.getGroupById("ippon.fr", groupId);
        assertEquals(groupName, group.getName());
        assertEquals(groupDescription, group.getDescription());
        assertTrue(group.isPublicGroup());
        assertFalse(group.isArchivedGroup());
    }

    @Test
    public void createGroup() {
        mockAuthentication("jdubois@ippon.fr");

        User user = userService.getUserByLogin("jdubois@ippon.fr");
        assertEquals(0, groupService.getGroupsForUser(user).size());

        String groupName = "Group name";
        String groupDescription = "Group description";
        boolean publicGroup = true;
        groupService.createGroup(groupName, groupDescription, publicGroup);
        Collection<Group> groups = groupService.getGroupsForUser(user);
        assertEquals(1, groups.size());

        Group group = groups.iterator().next();
        assertEquals(groupName, group.getName());
        assertEquals(groupDescription, group.getDescription());
        assertTrue(group.isPublicGroup());
        assertFalse(group.isArchivedGroup());
    }

    @Test
    public void addAndRemoveGroupMember() {
        mockAuthentication("userWithStatus@ippon.fr");

        User user = userService.getUserByLogin("userWithStatus@ippon.fr");
        assertEquals(0, groupService.getGroupsForUser(user).size());

        String groupName = "Group name";
        String groupDescription = "Group description";
        boolean publicGroup = true;
        groupService.createGroup(groupName, groupDescription, publicGroup);
        Collection<Group> groups = groupService.getGroupsForUser(user);
        assertEquals(1, groups.size());
        Group group = groups.iterator().next();
        String groupId = group.getGroupId();

        User member = userService.getUserByLogin("userWhoPostStatus@ippon.fr");

        assertEquals(1, groupService.getGroupsForUser(user).size());
        assertEquals(0, groupService.getGroupsForUser(member).size());

        Collection<UserGroupDTO> members = groupService.getMembersForGroup(groupId, user.getLogin());
        assertEquals(1, members.size());

        groupService.addMemberToGroup(member, group);
        members = groupService.getMembersForGroup(groupId, user.getLogin());
        assertEquals(2, members.size());

        assertEquals(1, groupService.getGroupsForUser(user).size());
        assertEquals(1, groupService.getGroupsForUser(member).size());

        groupService.removeMemberFromGroup(member, group);
        members = groupService.getMembersForGroup(groupId, user.getLogin());
        assertEquals(1, members.size());

        assertEquals(1, groupService.getGroupsForUser(user).size());
        assertEquals(0, groupService.getGroupsForUser(member).size());

        // Clean up
        groupService.removeMemberFromGroup(user, group);
        assertEquals(0, groupService.getGroupsForUser(user).size());
    }

    private void mockAuthentication(String login) {
        User authenticateUser = constructAUser(login);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        when(mockAuthenticationService.getCurrentUser()).thenReturn(authenticateUser);
        ReflectionTestUtils.setField(groupService, "authenticationService", mockAuthenticationService);
        ReflectionTestUtils.setField(userService, "authenticationService", mockAuthenticationService);
    }
}