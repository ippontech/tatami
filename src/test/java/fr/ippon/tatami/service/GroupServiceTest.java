/**
 * 
 */
package fr.ippon.tatami.service;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;
import org.mortbay.log.Log;

import javax.inject.Inject;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.GroupDetailsRepository;
import fr.ippon.tatami.security.AuthenticationService;

/**
 * @author PHEJAR
 * 
 */
public class GroupServiceTest extends AbstractCassandraTatamiTest {

	// Atribut
	private String description = "la description";
	private String name = "MonGroupe";
	private String groupId = "Id01";
	private static final String domain = "ippon.fr";

	@Inject
	private static User userTotest;

	private static final String domainName = "ippon.fr";
	private static final String login = "uuser@ippon.fr";
	private static final String firstName = "uuser";
	private static final String lastName = "UpdatedLastName";
	private static final String gravatar = "newGravatar";
	private static final String password = "MotDePasse";

	@Inject
	public UserService userService;
	
	/**
	 * The service to test.
	 */
	
	private static GroupService groupServiceToTest = new GroupService();

	/**
	 * Initialisation des éléments de Test
	 * 
	 * @throws Exception
	 */
	@Before
	public void setUp() throws Exception {
		Log.info("Creation du user à tester");
		userTotest = constructAUser(login, firstName, lastName);
		userTotest.setPassword(password);
		mockAuthenticationOnUserService(login);
		

	}

	
	private void mockAuthenticationOnUserService(String login) {
		User authenticateUser = constructAUser(login);
		AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
		when(mockAuthenticationService.getCurrentUser()).thenReturn(
				authenticateUser);
		userService.setAuthenticationService(mockAuthenticationService);
	}
	/**
	 * Test method for
	 * {@link fr.ippon.tatami.service.GroupService#createGroup(java.lang.String, java.lang.String, boolean)}
	 * .
	 */
	@Test
	public void testCreateGroup() {
//		Log.info("Creation du group à tester");
//		mockAuthenticationOnUserService(login);
//		groupServiceToTest.createGroup(name, description, true);
	}

	/**
	 * Test method for
	 * {@link fr.ippon.tatami.service.GroupService#editGroup(fr.ippon.tatami.domain.Group)}
	 * .
	 */
	@Test
	public void testEditGroup() {

		
//		Log.info("Preparation du groupe à tester");
//		
//		mockAuthenticationOnUserService(login);
//		Group groupeTotest = groupServiceToTest.getGroupById(domain, groupId);
//		groupServiceToTest.editGroup(groupeTotest);

	}

	/**
	 * Test method for
	 * {@link fr.ippon.tatami.service.GroupService#getMembersForGroup(java.lang.String)}
	 * .
	 */
	@Test
	public void testGetMembersForGroup() {
		Log.info("Non implémenté");
	}

	/**
	 * Test method for
	 * {@link fr.ippon.tatami.service.GroupService#getGroupsForUser(fr.ippon.tatami.domain.User)}
	 * .
	 */
	@Test
	public void testGetGroupsForUser() {
		Log.info("Non implémenté");
	}

	/**
	 * Test method for
	 * {@link fr.ippon.tatami.service.GroupService#getGroupById(java.lang.String, java.lang.String)}
	 * .
	 */
	@Test
	public void testGetGroupById() {
		Log.info("Non implémenté");
	}

	/**
	 * Test method for
	 * {@link fr.ippon.tatami.service.GroupService#getGroupsWhereCurrentUserIsAdmin()}
	 * .
	 */
	@Test
	public void testGetGroupsWhereCurrentUserIsAdmin() {
		Log.info("Non implémenté");
	}

	/**
	 * Test method for
	 * {@link fr.ippon.tatami.service.GroupService#addMemberToGroup(fr.ippon.tatami.domain.User, fr.ippon.tatami.domain.Group)}
	 * .
	 */
	@Test
	public void testAddMemberToGroup() {
		Log.info("Non implémenté");
	}

	/**
	 * Test method for
	 * {@link fr.ippon.tatami.service.GroupService#removeMemberFromGroup(fr.ippon.tatami.domain.User, fr.ippon.tatami.domain.Group)}
	 * .
	 */
	@Test
	public void testRemoveMemberFromGroup() {
		Log.info("Non implémenté");
	}

}
