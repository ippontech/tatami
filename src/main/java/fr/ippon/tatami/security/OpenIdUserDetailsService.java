package fr.ippon.tatami.security;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;

/**
 * Connects OpenId with the application.
 *
 * @author Julien Dubois
 */
@Service
public class OpenIdUserDetailsService implements UserDetailsService {

    private final Log log = LogFactory.getLog(OpenIdUserDetailsService.class);

    @Inject
    private UserService userService;

    public UserDetails loadUserByUsername(String token) {
        User user = userService.getUserByOpenIdToken(token);
        if (user == null) {
            throw new UsernameNotFoundException("User not found for token: " + token);
        } else {
            if (log.isDebugEnabled()) {
                log.debug("Authenticated user=" + user);
            }
            Collection<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();
            GrantedAuthority grantedAuthority = new SimpleGrantedAuthority("ROLE_USER");
            grantedAuthorities.add(grantedAuthority);
            return new org.springframework.security.core.userdetails.User(user.getEmail(), "", grantedAuthorities);
        }
    }
}
