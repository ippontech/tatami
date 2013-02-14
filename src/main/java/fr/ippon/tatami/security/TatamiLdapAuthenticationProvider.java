package fr.ippon.tatami.security;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.authentication.BadCredentialsException;
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

    private final Log log = LogFactory.getLog(TatamiLdapAuthenticationProvider.class);

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
            if (log.isDebugEnabled()) {
                log.debug("User login " + login + " is incorrect.");
            }

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
        if (log.isDebugEnabled()) {
            log.debug("Authenticating " + authentication.getName() + " with LDAP");
        }
        String login = authentication.getName().toLowerCase();
        String username = DomainUtil.getUsernameFromLogin(login);

        // Use temporary token to use username, and not login to authenticate on ldap :
        UsernamePasswordAuthenticationToken tmpAuthentication =
                new UsernamePasswordAuthenticationToken(username, authentication.getCredentials(), null);
        super.authenticate(tmpAuthentication);

        //Automatically create LDAP users in Tatami
        User user = userService.getUserByLogin(login);
        if (user == null) {
            user = new User();
            user.setLogin(login);
            user.setTheme(Constants.DEFAULT_THEME);
            userService.createUser(user);
        } else {
            // ensure that this user has access to its domain if it has been created before
            domainRepository.updateUserInDomain(user.getDomain(), user.getLogin());
        }

        // The real authentication object uses the login, and not the username
        TatamiUserDetails realUser = userDetailsService.getTatamiUserDetails(login,
                authentication.getCredentials().toString());

        UsernamePasswordAuthenticationToken realAuthentication =
                new UsernamePasswordAuthenticationToken(realUser, authentication.getCredentials(),
                        realUser.getAuthorities());

        return realAuthentication;
    }
}
