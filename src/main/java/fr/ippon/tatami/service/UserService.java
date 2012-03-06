package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.OpenId;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.OpenIdRepository;
import fr.ippon.tatami.repository.UserRepository;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Inject
    private OpenIdRepository openIdRepository;

    public User getUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    public User getUserByOpenIdToken(String token) {
        OpenId openId = openIdRepository.findOpenIdByToken(token);
        if (openId == null) {
            return null;
        }
        return getUserByEmail(openId.getEmail());
    }

    public void createOrUpdateUser(User user) {
        userRepository.createUser(user);
        OpenId openId = new OpenId();
        openId.setToken(user.getOpenIdToken());
        openId.setEmail(user.getEmail());
        openIdRepository.createOpenId(openId);
    }

    public void addFollower(String email) {
        User currentUser = getCurrentUser();
        User follower = getUserByEmail(email);

    }

    public User getCurrentUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        org.springframework.security.core.userdetails.User springSecurityUser = (org.springframework.security.core.userdetails.User) securityContext
                .getAuthentication().getPrincipal();

        return getUserByEmail(springSecurityUser.getUsername());
    }
}
