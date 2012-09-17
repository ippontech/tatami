package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.User;

import javax.validation.ConstraintViolationException;

/**
 * The User Repository.
 *
 * @author Julien Dubois
 */
public interface UserRepository {

    void createUser(User user);

    void updateUser(User user) throws ConstraintViolationException, IllegalArgumentException;

    void deleteUser(User user);

    User findUserByLogin(String login);
}
