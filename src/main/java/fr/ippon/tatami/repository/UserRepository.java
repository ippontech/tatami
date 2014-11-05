package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.User;

import javax.validation.ConstraintViolationException;

import com.google.common.base.Optional;

/**
 * The User Repository.
 *
 * @author Julien Dubois
 */
public interface UserRepository {

    void createUser(User user);

    void updateUser(User user) throws ConstraintViolationException, IllegalArgumentException;

    void deleteUser(User user);

    void desactivateUser( User user );

    void reactivateUser( User user );

    Optional<User> findUserByLogin(String login);
}
