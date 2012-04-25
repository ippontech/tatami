package fr.ippon.tatami.repository;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;
import org.junit.Test;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

public class UserRepositoryTest extends AbstractCassandraTatamiTest {

    @Inject
    public UserRepository userRepository;

    @Test
    public void shouldGetAUserRepositoryInjected() {
        assertThat(userRepository, notNullValue());
    }

    @Test
    public void shouldCreateAUser() {
        String login = "ulogin";
        String firstName = "New";
        String lastName = "User";
        String email = "nuuser@ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.createUser(user);

        assertThat(userRepository.findUserByLogin("ulogin"), notNullValue());
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAUserBecauseLoginNull() {
        String login = null;
        String firstName = "New";
        String lastName = "User";
        String email = "nuser@ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.createUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotCreateAUserBecauseLoginEmpty() {
        String login = "";
        String firstName = "New";
        String lastName = "User";
        String email = "nuser@ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.createUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotCreateAUserBecauseEmailInvalid() {
        String login = "nuser-testemail";
        String firstName = "New";
        String lastName = "User";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.createUser(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAUserBecauseLastNameNull() {
        String login = "nuser-testemail";
        String firstName = "fs";
        String lastName = null;
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.createUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotCreateAUserBecauseLastNameEmpty() {
        String login = "nuser-testemail";
        String firstName = "eee";
        String lastName = "";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.createUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotCreateAUserBecauseLastNameWithSeventeenCharacters() {
        String login = "nuser-testemail";
        String firstName = "eeee";
        String lastName = "12345678901234567";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.createUser(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAUserBecauseFirstNameNull() {
        String login = "nuser-testemail";
        String firstName = null;
        String lastName = "User";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.createUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotCreateAUserBecauseFirstNameEmpty() {
        String login = "nuser-testemail";
        String firstName = "";
        String lastName = "User";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.createUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotCreateAUserBecauseFirstNameWithSeventeenCharacters() {
        String login = "nuser-testemail";
        String firstName = "12345678901234567";
        String lastName = "User";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.createUser(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotUpdateAUserBecauseLoginNull() {
        String login = null;
        String firstName = "New";
        String lastName = "User";
        String email = "nuser@ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotUpdateAUserBecauseLoginEmpty() {
        String login = "";
        String firstName = "New";
        String lastName = "User";
        String email = "nuser@ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotUpdateAUserBecauseEmailInvalid() {
        String login = "nuser-testemail";
        String firstName = "New";
        String lastName = "User";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotUpdateAUserBecauseLastNameNull() {
        String login = "nuser-testemail";
        String firstName = "fs";
        String lastName = null;
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotUpdateAUserBecauseLastNameEmpty() {
        String login = "nuser-testemail";
        String firstName = "eee";
        String lastName = "";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotUpdateAUserBecauseLastNameWithSeventeenCharacters() {
        String login = "nuser-testemail";
        String firstName = "eeee";
        String lastName = "12345678901234567";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotUpdateAUserBecauseFirstNameNull() {
        String login = "nuser-testemail";
        String firstName = null;
        String lastName = "User";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotUpdateAUserBecauseFirstNameEmpty() {
        String login = "nuser-testemail";
        String firstName = "";
        String lastName = "User";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotUpdateAUserBecauseFirstNameWithSeventeenCharacters() {
        String login = "nuser-testemail";
        String firstName = "12345678901234567";
        String lastName = "User";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }
}