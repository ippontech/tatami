package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.User;

/**
 * The User Respository.
 *
 * @author Julien Dubois
 */
public interface UserRepository {

    void createUser(User user);

    User findUserByLogin(String login);
}
