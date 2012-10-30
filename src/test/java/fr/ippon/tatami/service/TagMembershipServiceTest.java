/**
 * 
 */
package fr.ippon.tatami.service;

import static org.junit.Assert.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.Test;

import com.google.inject.Inject;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.web.rest.dto.Tag;

/**
 * @author PHEJAR
 *
 */
public class TagMembershipServiceTest extends AbstractCassandraTatamiTest{
	

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
		
		/*
		 * Initialisatioin du User
		 */
        String login = "user@ippon.fr";
        String firstName = "UpdatedFirstName";
        String lastName = "UpdatedLastName";

		
		
		tagTest.setName(name);
		tagTest.setScope(scope);
        User userTest = constructAUser(login, firstName, lastName);
		
		TagMembershipService tagMembershipServiceTest = new TagMembershipService();
        
		
		
        tagMembershipServiceTest.followTag(tagTest);
		
		
	}


	/**
	 * Test method for {@link fr.ippon.tatami.service.TagMembershipService#unfollowTag(fr.ippon.tatami.web.rest.dto.Tag)}.
	 */
	@Test
	public void testUnfollowTag() {
		fail("Not yet implemented"); // TODO
	}

}
