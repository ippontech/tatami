package fr.ippon.tatami.security;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;
import org.pac4j.springframework.security.authentication.ClientAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import javax.inject.Inject;

/**
 *
 */
@Component
public class GoogleAutoRegisteringUserDetailsService implements AuthenticationUserDetailsService<ClientAuthenticationToken> {
    private final Logger log = LoggerFactory.getLogger(GoogleAutoRegisteringUserDetailsService.class);

    private static final String EMAIL_ATTRIBUTE = "email";
    private static final String FIRSTNAME_ATTRIBUTE = "given_name";
    private static final String LASTNAME_ATTRIBUTE = "family_name";
    private static final String FULLNAME_ATTRIBUTE = "name";

    @Inject
    private UserService userService;

    @Inject
    private DomainRepository domainRepository;

    @Inject
    private TatamiUserDetailsService userDetailsService; // => handles grantedAuthorities

    @Override
    public UserDetails loadUserDetails(ClientAuthenticationToken token) throws UsernameNotFoundException {
        String login = getAttributeValue(token, EMAIL_ATTRIBUTE);

        if (login == null) {
            String msg = "OAuth response did not contain the user email";
            log.error(msg);
            throw new UsernameNotFoundException(msg);
        }
        if (!login.contains("@")) {
            log.debug("User login {} from OAuth response is incorrect.", login);
            throw new UsernameNotFoundException("OAuth response did not contains a valid user email");
        }

        // Automatically create OpenId users in Tatami :
        UserDetails userDetails;
        try {
            userDetails = userDetailsService.loadUserByUsername(login);
            // ensure that this user has access to its domain if it has been created before
            domainRepository.updateUserInDomain(DomainUtil.getDomainFromLogin(login), login);

        } catch (UsernameNotFoundException e) {
            log.info("User with login : \"{}\" doesn't exist yet in Tatami database - creating it...", login);
            userDetails = getNewlyCreatedUserDetails(token);
        }
        return userDetails;
    }

    private org.springframework.security.core.userdetails.User getNewlyCreatedUserDetails(ClientAuthenticationToken token) {
        String login = getAttributeValue(token, EMAIL_ATTRIBUTE);
        String firstName = getAttributeValue(token, FIRSTNAME_ATTRIBUTE);
        String lastName = getAttributeValue(token, LASTNAME_ATTRIBUTE);

        String fullName = getAttributeValue(token, FULLNAME_ATTRIBUTE);
        if (firstName == null && lastName == null) {
            // if we haven't first nor last name, we use fullName as last name to begin with :
            lastName = fullName;
        }

        User user = new User();
        // Note : The email could change... and the OpenId not
        // moreover an OpenId account could potentially be associated with several email addresses
        // so we store it for future use case :

        user.setLogin(login);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        log.debug("User: {}", user);
        userService.createUser(user);

        return userDetailsService.getTatamiUserDetails(login, user.getPassword());
    }

    private String getAttributeValue(ClientAuthenticationToken token, String name) {
        return (String) token.getUserProfile().getAttributes().get(name);
    }
}
