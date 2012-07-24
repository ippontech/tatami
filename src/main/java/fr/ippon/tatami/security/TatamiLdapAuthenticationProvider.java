package fr.ippon.tatami.security;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.authentication.LdapAuthenticator;
import org.springframework.security.ldap.userdetails.LdapAuthoritiesPopulator;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;

/**
 * Tatami specific LdapAuthenticationProvider.
 *
 * @author Julien Dubois
 */
public class TatamiLdapAuthenticationProvider extends LdapAuthenticationProvider {

    private final Log log = LogFactory.getLog(TatamiLdapAuthenticationProvider.class);

    private Collection<GrantedAuthority> userGrantedAuthorities = new ArrayList<GrantedAuthority>();

    private Collection<GrantedAuthority> adminGrantedAuthorities = new ArrayList<GrantedAuthority>();

    private Collection<String> adminUsers = null;

    @Inject
    private UserService userService;

    @Inject
    private DomainRepository domainRepository;

    @Inject
    Environment env;

    public TatamiLdapAuthenticationProvider(LdapAuthenticator authenticator, LdapAuthoritiesPopulator authoritiesPopulator) {
        super(authenticator, authoritiesPopulator);
    }

    public TatamiLdapAuthenticationProvider(LdapAuthenticator authenticator) {
        super(authenticator);
    }

    @PostConstruct
    public void init() {
        //Roles for "normal" users
        GrantedAuthority roleUser = new SimpleGrantedAuthority("ROLE_USER");
        userGrantedAuthorities.add(roleUser);

        //Roles for "admin" users, configured in tatami.properties
        GrantedAuthority roleAdmin = new SimpleGrantedAuthority("ROLE_ADMIN");
        adminGrantedAuthorities.add(roleUser);
        adminGrantedAuthorities.add(roleAdmin);

        String adminUsersList = this.env.getProperty("tatami.admin.users");
        String[] adminUsersArray = adminUsersList.split(",");
        adminUsers = new ArrayList<String>(Arrays.asList(adminUsersArray));
        if (log.isDebugEnabled()) {
            for (String admin : adminUsers) {
                log.debug("User \"" + admin + "\" is an administrator.");
            }
        }
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String login = authentication.getName();
        if (!login.contains("@")) {
            if (log.isDebugEnabled()) {
                log.debug("User login " + login + " is incorrect.");
            }

            throw new BadCredentialsException(messages.getMessage(
                    "LdapAuthenticationProvider.badCredentials", "Bad credentials"));
        }
        String username = DomainUtil.getUsernameFromLogin(login);

        Collection<GrantedAuthority> grantedAuthorities = null;
        if (adminUsers.contains(login)) {
            if (log.isDebugEnabled()) {
                log.debug("User \"" + login + "\" is an administrator.");
            }
            grantedAuthorities = adminGrantedAuthorities;
        } else {
            grantedAuthorities = userGrantedAuthorities;
        }

        // Use temporarily the username, and not the login, to authenticate
        org.springframework.security.core.userdetails.User tmpUser =
                new org.springframework.security.core.userdetails.User(username, (String) authentication.getCredentials(),
                        grantedAuthorities);

        UsernamePasswordAuthenticationToken tmpAuthentication =
                new UsernamePasswordAuthenticationToken(tmpUser, authentication.getCredentials(),
                        grantedAuthorities);

        super.authenticate(tmpAuthentication);

        //Automatically create LDAP users in Tatami
        User user = userService.getUserByLogin(login);
        if (user == null) {
            user = new User();
            user.setLogin(login);
            userService.createUser(user);
        }
        domainRepository.updateUserInDomain(user.getDomain(), user.getLogin());

        // The real autentication object uses the login, and not the username
        org.springframework.security.core.userdetails.User realUser =
                new org.springframework.security.core.userdetails.User(login, (String) authentication.getCredentials(),
                        grantedAuthorities);

        UsernamePasswordAuthenticationToken realAuthentication =
                new UsernamePasswordAuthenticationToken(realUser, authentication.getCredentials(),
                        grantedAuthorities);

        return realAuthentication;
    }
}
