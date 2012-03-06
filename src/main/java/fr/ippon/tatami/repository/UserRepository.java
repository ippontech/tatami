package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.User;

/**
 * The User Respository.
 *
 * @author Julien Dubois
 */
public interface UserRepository {

    void createUser(User user);

    void updateUser(User user);

    void deleteUser(String email);

    User findUserByEmail(String email);
}
