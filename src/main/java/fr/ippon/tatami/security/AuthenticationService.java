package fr.ippon.tatami.security;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import org.pac4j.core.profile.UserProfile;
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
        Object principal = securityContext.getAuthentication().getPrincipal();
        String username = null;
        System.out.println("TESTING " + principal);
        if(principal instanceof UserProfile) {
            username = (String)((UserProfile) principal).getAttribute("email");
        }
        else {
            username = ((UserDetails) principal).getUsername();
        }
/*
        System.out.println("TEST " + securityContext.getAuthentication());
        UserDetails springSecurityUser =
                (UserDetails) securityContext
                        .getAuthentication().getPrincipal();
*/
        return userRepository.findUserByLogin(username);
    }

    public boolean hasAuthenticatedUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return (securityContext.getAuthentication() != null);
    }
}