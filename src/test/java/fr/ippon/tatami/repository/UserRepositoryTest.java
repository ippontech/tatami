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
    private UserRepository userRepository;

    @Inject
    private CounterRepository counterRepository;

    @Test
    public void shouldGetAUserRepositoryInjected() {
        assertThat(userRepository, notNullValue());
    }

    @Test
    public void shouldCreateAUser() {
        String login = "nuuser@ippon.fr";
        String firstName = "New";
        String lastName = "User";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setPassword("");
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        counterRepository.createStatusCounter(user.getLogin());
        counterRepository.createFriendsCounter(user.getLogin());
        counterRepository.createFollowersCounter(user.getLogin());
        userRepository.createUser(user);

        assertThat(userRepository.findUserByLogin("nuuser@ippon.fr"), notNullValue());
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAUserBecauseLoginNull() {
        String login = null;
        String firstName = "New";
        String lastName = "User";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        userRepository.createUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotCreateAUserBecauseLoginEmpty() {
        String login = "";
        String firstName = "New";
        String lastName = "User";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        userRepository.createUser(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotUpdateAUserBecauseLoginNull() {
        String login = null;
        String firstName = "New";
        String lastName = "User";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotUpdateAUserBecauseLoginEmpty() {
        String login = "";
        String firstName = "New";
        String lastName = "User";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotUpdateAUserBecauseEmailInvalid() {
        String login = "nuser_ippon.fr";
        String firstName = "New";
        String lastName = "User";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotUpdateAUserBecauseLastNameNull() {
        String login = "nuser_ippon.fr";
        String firstName = "fs";
        String lastName = null;
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotUpdateAUserBecauseLastNameEmpty() {
        String login = "nuser_ippon.fr";
        String firstName = "eee";
        String lastName = "";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotUpdateAUserBecauseLastNameWithSeventeenCharacters() {
        String login = "nuser_ippon.fr";
        String firstName = "eeee";
        String lastName = "12345678901234567";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotUpdateAUserBecauseFirstNameNull() {
        String login = "nuser_ippon.fr";
        String firstName = null;
        String lastName = "User";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotUpdateAUserBecauseFirstNameEmpty() {
        String login = "nuser_ippon.fr";
        String firstName = "";
        String lastName = "User";
        String email = "nuser_ippon.fr";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldNotUpdateAUserBecauseFirstNameWithSeventeenCharacters() {
        String login = "nuser_ippon.fr";
        String firstName = "12345678901234567";
        String lastName = "User";
        String gravatar = "newGravatar";

        User user = new User();
        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setGravatar(gravatar);

        userRepository.updateUser(user);
    }
}