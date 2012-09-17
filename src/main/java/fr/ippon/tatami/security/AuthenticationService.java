package fr.ippon.tatami.security;

import javax.inject.Inject;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;

/**
 * This service is used to find the current user.
 *
 * @author Julien Dubois
 */
@Service
public class AuthenticationService {

    //    private final Log log = LogFactory.getLog(AuthenticationService.class);

    @Inject
    private UserRepository userRepository;

    public User getCurrentUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        org.springframework.security.core.userdetails.UserDetails springSecurityUser =
                (org.springframework.security.core.userdetails.UserDetails) securityContext
                .getAuthentication().getPrincipal();

        return userRepository.findUserByLogin(springSecurityUser.getUsername());
    }
}