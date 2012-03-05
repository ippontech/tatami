package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 * Manages the application's users.
 *
 * @author Julien Dubois
 */
@Service
public class UserService {

    @Inject
    private UserRepository userRepository;

    public User getUserByLogin(String login) {
        return userRepository.findUserByLogin(login);
    }
}
