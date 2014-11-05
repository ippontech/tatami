package fr.ippon.tatami.security;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.google.common.base.Optional;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;

/**
 * This service is user to find the current user.
 *
 * @author Julien Dubois
 */
@Service
public class AuthenticationService {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

    @Inject
    private UserRepository userRepository;

    public User getCurrentUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        UserDetails springSecurityUser =
                (UserDetails) securityContext
                        .getAuthentication().getPrincipal();

        // If user is authenticated, it should exist. Let's believe that for now.
        String username = springSecurityUser.getUsername();
        Optional<User> userByLogin = userRepository.findUserByLogin(username);
        if (!userByLogin.isPresent()) {
            log.error("Trying to get current user ({}) from context but it no longer exists", username);
        }
        return userByLogin.get();
    }

    public boolean hasAuthenticatedUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return (securityContext.getAuthentication() != null);
    }
}