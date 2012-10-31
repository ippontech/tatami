/**
 * 
 */
package fr.ippon.tatami.service;

import static org.junit.Assert.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;
import org.mortbay.log.Log;

import javax.inject.Inject;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.web.rest.dto.Tag;

/**
 * @author PHEJAR
 *
 */
public class TagMembershipServiceTest extends AbstractCassandraTatamiTest{

	@Inject
	private static User userTotest;

	@Inject
	public UserService userService;

	private static final String domainName = "ippon.fr";
	private static final String login = "uuser@ippon.fr";
	private static final String firstName = "uuser";
	private static final String lastName = "UpdatedLastName";
	private static final String gravatar = "newGravatar";
	private static final String password = "MotDePasse";

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
	 * Test method for {@link fr.ippon.tatami.service.TagMembershipService#followTag(fr.ippon.tatami.web.rest.dto.Tag)}.
	 */
	@Test
	public void testFollowTag() {
		/*
		 * Initialisation du Tag
		 */
		Tag tagTest = new Tag();
		String name = "Mon Tag";
		String scope = "Scope Tag";
	
		
		tagTest.setName(name);
		tagTest.setScope(scope);
	
		TagMembershipService tagMembershipServiceTest = new TagMembershipService();    
		mockAuthenticationOnUserService(login);
		//tagMembershipServiceTest.followTag(tagTest);
		
		
	}


	/**
	 * Test method for {@link fr.ippon.tatami.service.TagMembershipService#unfollowTag(fr.ippon.tatami.web.rest.dto.Tag)}.
	 */
	@Test
	public void testUnfollowTag() {
	
		Tag tagTest = new Tag();
		String name = "Mon Tag";
		String scope = "Scope Tag";
	
		
		tagTest.setName(name);
		tagTest.setScope(scope);
	
		TagMembershipService tagMembershipServiceTest = new TagMembershipService();
		//tagMembershipServiceTest.unfollowTag(tagTest);
	}

}
