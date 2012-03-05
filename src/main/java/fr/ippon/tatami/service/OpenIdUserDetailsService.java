package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
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
    private UserRepository userRepository;

    public UserDetails loadUserByUsername(String openIdIdentifier) {
        // TODO find by Open ID
        User user = userRepository.findUserByEmail(openIdIdentifier);
        if (user == null) {
            throw new UsernameNotFoundException("User not found for OpenID: " + openIdIdentifier);
        } else {
            log.debug("Found user=" + user);
            Collection<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();
            GrantedAuthority grantedAuthority = new SimpleGrantedAuthority("ROLE_USER");
            grantedAuthorities.add(grantedAuthority);
            return new org.springframework.security.core.userdetails.User(user.getEmail(), "", grantedAuthorities);
        }
    }
}
