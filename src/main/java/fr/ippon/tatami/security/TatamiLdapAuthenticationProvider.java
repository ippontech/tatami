package fr.ippon.tatami.security;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.authentication.LdapAuthenticator;

import javax.inject.Inject;

/**
 * Tatami specific LdapAuthenticationProvider.
 *
 * @author Julien Dubois
 */
public class TatamiLdapAuthenticationProvider extends LdapAuthenticationProvider {

    private final Logger log = LoggerFactory.getLogger(TatamiLdapAuthenticationProvider.class);

    @Inject
    private UserService userService;

    @Inject
    private DomainRepository domainRepository;

    @Inject
    private TatamiUserDetailsService userDetailsService; // => handles grantedAuthorities

    /**
     * The domain on which this provider is suitable to authenticate user
     */
    private String managedDomain;

    public TatamiLdapAuthenticationProvider(LdapAuthenticator authenticator, String managedDomain) {
        super(authenticator);
        if (StringUtils.isEmpty(managedDomain)) {
            throw new IllegalArgumentException("You must provide a managedDomain on this TatamiLdapAuthenticationProvider");
        }
        this.managedDomain = managedDomain;
    }

    private boolean canHandleAuthentication(Authentication authentication) {
        String login = authentication.getName();
        if (!login.contains("@")) {
            log.debug("User login {} is incorrect.", login);

            throw new BadCredentialsException(messages.getMessage(
                    "LdapAuthenticationProvider.badCredentials", "Bad credentials"));
        }
        String domain = DomainUtil.getDomainFromLogin(login);
        return domain.equalsIgnoreCase(managedDomain);
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (!canHandleAuthentication(authentication)) {
            return null; // this provider is not suitable for this domain
        }

        log.debug("Authenticating {} with LDAP", authentication.getName());
        String login = authentication.getName().toLowerCase();
        String username = DomainUtil.getUsernameFromLogin(login);

        // Use temporary token to use username, and not login to authenticate on ldap :
        UsernamePasswordAuthenticationToken tmpAuthentication =
                new UsernamePasswordAuthenticationToken(username, authentication.getCredentials(), null);

        try {
            super.authenticate(tmpAuthentication);
        } catch (InternalAuthenticationServiceException iase) {
            // Without this : there is no log when the ldap server or the ldap configuration is broken : 
            log.error("Internal Error while authenticating " + authentication.getName() + " with LDAP", iase);
            throw iase;
        }

        //Automatically create LDAP users in Tatami
        User user = userService.getUserByLogin(login);
        if (user == null) {
            user = new User();
            user.setLogin(login);
            userService.createUser(user);
        } else {
            // ensure that this user has access to its domain if it has been created before
            domainRepository.updateUserInDomain(user.getDomain(), user.getLogin());
        }

        // The real authentication object uses the login, and not the username
        org.springframework.security.core.userdetails.User realUser = userDetailsService.getTatamiUserDetails(login,
                authentication.getCredentials().toString());

        return
                new UsernamePasswordAuthenticationToken(realUser, authentication.getCredentials(),
                        realUser.getAuthorities());

    }
}
