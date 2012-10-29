/**
 * 
 */
package fr.ippon.tatami.service;

import static org.junit.Assert.*;

import org.junit.Test;
import org.mortbay.log.Log;

import com.google.inject.Inject;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.repository.GroupDetailsRepository;

/**
 * @author PHEJAR
 *
 */
public class GroupServiceTest {

	/**
	 * The service to test.
	 */
	@Inject
	public GroupService groupServiceToTest;
	
	
	
	/**
	 * Test method for {@link fr.ippon.tatami.service.GroupService#createGroup(java.lang.String, java.lang.String, boolean)}.
	 */
	@Test
	public void testCreateGroup() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for {@link fr.ippon.tatami.service.GroupService#editGroup(fr.ippon.tatami.domain.Group)}.
	 */
	@Test
	public void testEditGroup() {
		
		GroupDetailsRepository groupDetailsRepository;
		Log.info("Preparation du groupe à tester");
		String description = "la description";
		String name = "MonGroupe";
		String groupId = "Id01";
		String domain ="MonDomaine";
		
		Group groupToTest = new Group();
		
		groupToTest.setDescription(description);
		groupToTest.setDomain(domain);
		groupToTest.setGroupId(groupId);
		groupToTest.setName(name);
		
		
		groupServiceToTest.editGroup(groupToTest);
		
		
		
	}

	/**
	 * Test method for {@link fr.ippon.tatami.service.GroupService#getMembersForGroup(java.lang.String)}.
	 */
	@Test
	public void testGetMembersForGroup() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for {@link fr.ippon.tatami.service.GroupService#getGroupsForUser(fr.ippon.tatami.domain.User)}.
	 */
	@Test
	public void testGetGroupsForUser() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for {@link fr.ippon.tatami.service.GroupService#getGroupById(java.lang.String, java.lang.String)}.
	 */
	@Test
	public void testGetGroupById() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for {@link fr.ippon.tatami.service.GroupService#getGroupsWhereCurrentUserIsAdmin()}.
	 */
	@Test
	public void testGetGroupsWhereCurrentUserIsAdmin() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for {@link fr.ippon.tatami.service.GroupService#addMemberToGroup(fr.ippon.tatami.domain.User, fr.ippon.tatami.domain.Group)}.
	 */
	@Test
	public void testAddMemberToGroup() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for {@link fr.ippon.tatami.service.GroupService#removeMemberFromGroup(fr.ippon.tatami.domain.User, fr.ippon.tatami.domain.Group)}.
	 */
	@Test
	public void testRemoveMemberFromGroup() {
		fail("Not yet implemented"); // TODO
	}

}
