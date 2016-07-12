package fr.ippon.tatami.security;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 * This service is user to find the current user.
 *
 * @author Julien Dubois
 */
@Service
public class AuthenticationService {

    @Inject
    private UserRepository userRepository;

    public User getCurrentUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();

        UserDetails springSecurityUser =
                (UserDetails) securityContext
                        .getAuthentication().getPrincipal();

        return userRepository.findUserByLogin(springSecurityUser.getUsername());
    }

    public static boolean isCurrentUserInRole(String authority) {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserDetails) {
                UserDetails springSecurityUser = (UserDetails) authentication.getPrincipal();
                return springSecurityUser.getAuthorities().contains(new SimpleGrantedAuthority(authority));
            }
        }
        return false;
    }

    public boolean hasAuthenticatedUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return (securityContext.getAuthentication() != null);
    }
}