package fr.ippon.tatami.repository;

import java.util.List;

import fr.ippon.tatami.domain.User;

/**
 * The User Respository.
 *
 * @author Julien Dubois
 */
public interface UserRepository {

    void createUser(User user);

    void updateUser(User user);

    User findUserByLogin(String login);
    
    List<String> getSimilarUsers(String login);
}
