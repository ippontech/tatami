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
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;

/**
 * Finds a user in Cassandra.
 *
 * @author Julien Dubois
 */
@Component("userDetailsService")
public class TatamiUserDetailsService implements UserDetailsService {

    private final Log log = LogFactory.getLog(TatamiUserDetailsService.class);

    private Collection<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();

    @Inject
    private UserService userService;

    @PostConstruct
    public void init() {
        GrantedAuthority roleUser = new SimpleGrantedAuthority("ROLE_USER");
        grantedAuthorities.add(roleUser);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (log.isDebugEnabled()) {
            log.debug("Authenticating " + username + " with Cassandra");
        }
        User userFromCassandra = userService.getUserByLogin(username);
        if (userFromCassandra == null) {
            throw new UsernameNotFoundException("User " + username + " was not found in Cassandra");
        }
        org.springframework.security.core.userdetails.User springSecurityUser =
                new org.springframework.security.core.userdetails.User(username, userFromCassandra.getPassword(),
                        grantedAuthorities);

        return springSecurityUser;
    }
}
