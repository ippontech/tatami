package fr.ippon.tatami.service;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.inject.Inject;

import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mortbay.log.Log;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.security.AuthenticationService;

/**
 * La classe de Test UserService.
 * 
 * @author sdacalor
 * 
 */
public class UserServiceTest extends AbstractCassandraTatamiTest {

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

	@Inject
	public DomainRepository domainRepository;

	@Test
	public void shouldGetAUserServiceInjected() {
		assertThat(userService, notNullValue());
	}

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

	@Test
	public void shouldGetAUserByLogin() {
		User user = userService.getUserByLogin("jdubois@ippon.fr");
		assertThat(user, notNullValue());
		assertThat(user.getGravatar(), is("gravatar"));
		assertThat(user.getFirstName(), is("Julien"));
		assertThat(user.getLastName(), is("Dubois"));
	}

	@Test
	public void shouldNotGetAUserByLogin() {
		User user = userService.getUserByLogin("unknownUserLogin");
		assertThat(user, nullValue());
	}

	@Test
	public void shouldGetAUserProfileByLogin() {
		mockAuthenticationOnUserService("jdubois@ippon.fr");
		User user = userService.getUserByUsername("jdubois");
		assertThat(user.getStatusCount(), is(2L));
		assertThat(user.getFollowersCount(), is(3L));
		assertThat(user.getFriendsCount(), is(4L));
	}

	@Test
	public void shouldNotGetAUserProfileByLogin() {
		User user = userService.getUserByUsername("unknownUserLogin");
		assertThat(user, nullValue());
	}

	@Test
	public void shouldUpdateUser() {

		userService.updateUser(userTotest);

		User updatedUser = userService.getUserByLogin(login);

		assertThat(updatedUser.getFirstName(), is(firstName));
		assertThat(updatedUser.getLastName(), is(lastName));

	}

	@Test
	public void createUserWithUsernameAndDomain() {
		
		userService.createUser(userTotest);

		User createdUser = userService.getUserByUsername(firstName);

		assertThat(createdUser.getUsername(), is(firstName));
		assertThat(createdUser.getDomain(), is(domainName));
		assertNotNull(createdUser.getPassword());
		assertThat(createdUser.getPassword().length(), is(10)); // Size of the
																// encrypted
																// password
	}

	@Test
	public void shouldCreateAUser() {
		userService.createUser(userTotest);

		/* verify */
		User userToBeTheSame = userService.getUserByUsername(firstName);
		assertThat(userToBeTheSame.getLogin(), is(userTotest.getLogin()));
		assertThat(userToBeTheSame.getFirstName(),
				is(userTotest.getFirstName()));
		assertThat(userToBeTheSame.getLastName(), is(userTotest.getLastName()));
		assertThat(userToBeTheSame.getGravatar(), is(userTotest.getGravatar()));
		assertThat(userToBeTheSame.getStatusCount(), is(0L));
		assertThat(userToBeTheSame.getFollowersCount(), is(0L));
		assertThat(userToBeTheSame.getFriendsCount(), is(0L));
		
		Log.debug("Test avec Password nul");
		userTotest.setPassword(null);
		userService.createUser(userTotest);
		
	}

	private void mockAuthenticationOnUserService(String login) {
		User authenticateUser = constructAUser(login);
		AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
		when(mockAuthenticationService.getCurrentUser()).thenReturn(
				authenticateUser);
		userService.setAuthenticationService(mockAuthenticationService);
	}

	/**
	 * Méthode de test pour mettre à jour le pwd.
	 */
	@Test
	public void shouldUpdatePassword() {

		final String password = "MotDePasse";
		userTotest.setPassword(password);
		userService.updatePassword(userTotest);

		Assert.assertNotNull("Le mot de passe MotDePasse",
				userTotest.getPassword());

		User userUnConfigure = constructAUser(login, null, null);
		mockAuthenticationOnUserService(login);
		userService.updatePassword(userUnConfigure);
		Assert.assertEquals("L'utilisateur n'est pas configuré", null,
				userUnConfigure.getFirstName());
	}

	@Test
	public void shoulGetUsersByLogin() {

		mockAuthenticationOnUserService(login);

		Collection<String> loginsToTest = new ArrayList<String>();
		loginsToTest.add(login);
		Collection<User> collUserToTest = userService
				.getUsersByLogin(loginsToTest);

		Assert.assertFalse("La liste est remplie", collUserToTest.isEmpty());

	}

	@Test
	public void shouldGetUsersForCurrentDomain() {

		Log.info("Mise à jour du nombre user dans le domaine");
		domainRepository.updateUserInDomain(domainName, login);

		int currentDomainPagination = 0;

		mockAuthenticationOnUserService(login);
		List<User> listSearch = userService
				.getUsersForCurrentDomain(currentDomainPagination);

		Assert.assertEquals("La liste possède un user", 1, listSearch.size());

	}

	/**
	 * Methode de Test de l'enregistrement d'un utilisateur.
	 */
	@Test
	public void shouldRegisterUser() {

	}
	
	/**
	 * Test de la mise à jour du thème RoseIndia
	 */
	@Test
	public void shouldUpdateTheme(){
		
		String themeToTest = "RoseIndia";
		Log.info("Mise à jour de la configuration user");
		userTotest.setTheme(themeToTest);
		
		
		userService.updateTheme(themeToTest);
		
		Assert.assertEquals("Le theme est RoseIndia", themeToTest, userTotest.getTheme());
	}
}