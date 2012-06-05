package fr.ippon.tatami.security;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
import java.util.Collection;

/**
 * Tatami specific LdapAuthenticationProvider.
 *
 * @author Julien Dubois
 */
public class TatamiLdapAuthenticationProvider extends LdapAuthenticationProvider {

    private final Log log = LogFactory.getLog(TatamiLdapAuthenticationProvider.class);

    private Collection<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();

    @Inject
    private UserService userService;

    @Inject
    private DomainRepository domainRepository;

    public TatamiLdapAuthenticationProvider(LdapAuthenticator authenticator, LdapAuthoritiesPopulator authoritiesPopulator) {
        super(authenticator, authoritiesPopulator);
    }

    public TatamiLdapAuthenticationProvider(LdapAuthenticator authenticator) {
        super(authenticator);
    }

    @PostConstruct
    public void init() {
        GrantedAuthority roleUser = new SimpleGrantedAuthority("ROLE_USER");
        grantedAuthorities.add(roleUser);
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
        String username = DomainServiceImpl.getUsernameFromLogin(login);

        // Use temporarliy the username, and the login, to authenticate
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
