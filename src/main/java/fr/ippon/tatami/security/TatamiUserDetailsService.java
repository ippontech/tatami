package fr.ippon.tatami.security;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;

/**
 * Finds a user in Cassandra.
 *
 * @author Julien Dubois
 */
@Component("userDetailsService")
public class TatamiUserDetailsService implements UserDetailsService {

    private final Log log = LogFactory.getLog(TatamiUserDetailsService.class);

    private Collection<GrantedAuthority> userGrantedAuthorities = new ArrayList<GrantedAuthority>();

    private Collection<GrantedAuthority> adminGrantedAuthorities = new ArrayList<GrantedAuthority>();

    private Collection<String> adminUsers = null;

    @Inject
    private UserService userService;

    @Inject
    Environment env;

    @PostConstruct
    public void init() {
        //Roles for "normal" users
        GrantedAuthority roleUser = new SimpleGrantedAuthority("ROLE_USER");
        userGrantedAuthorities.add(roleUser);

        //Roles for "admin" users, configured in tatami.properties
        GrantedAuthority roleAdmin = new SimpleGrantedAuthority("ROLE_ADMIN");
        adminGrantedAuthorities.add(roleUser);
        adminGrantedAuthorities.add(roleAdmin);

        String adminUsersList = env.getProperty("tatami.admin.users");
        String[] adminUsersArray = adminUsersList.split(",");
        adminUsers = new ArrayList<String>(Arrays.asList(adminUsersArray));
        if (log.isDebugEnabled()) {
            for (String admin : adminUsers) {
                log.debug("Initialization : user \"" + admin + "\" is an administrator");
            }
        }
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        if (log.isDebugEnabled()) {
            log.debug("Authenticating " + login + " with Cassandra");
        }
        User userFromCassandra = userService.getUserByLogin(login);
        if (userFromCassandra == null) {
            throw new UsernameNotFoundException("User " + login + " was not found in Cassandra");
        }
        return getTatamiUserDetails(login, userFromCassandra.getPassword());
    }

    protected org.springframework.security.core.userdetails.User getTatamiUserDetails(String login, String password) {
        Collection<GrantedAuthority> grantedAuthorities = null;
        if (adminUsers.contains(login)) {
            if (log.isDebugEnabled()) {
                log.debug("User \"" + login + "\" is an administrator");
            }
            grantedAuthorities = adminGrantedAuthorities;
        } else {
            grantedAuthorities = userGrantedAuthorities;
        }

        return new org.springframework.security.core.userdetails.User(login, password,
                grantedAuthorities);
    }
}
