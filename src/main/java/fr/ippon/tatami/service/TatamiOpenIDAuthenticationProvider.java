package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.openid.OpenIDAttribute;
import org.springframework.security.openid.OpenIDAuthenticationProvider;
import org.springframework.security.openid.OpenIDAuthenticationToken;
import org.springframework.stereotype.Component;

import javax.inject.Inject;

/**
 * @author Julien Dubois
 */
@Component
public class TatamiOpenIDAuthenticationProvider extends OpenIDAuthenticationProvider {

    private final Log log = LogFactory.getLog(TatamiOpenIDAuthenticationProvider.class);

    @Inject
    private UserRepository userRepository;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (authentication instanceof OpenIDAuthenticationToken) {
            OpenIDAuthenticationToken openIDToken = (OpenIDAuthenticationToken) authentication;
            User user = new User();
            for (OpenIDAttribute attribute : openIDToken.getAttributes()) {
                if (attribute.getName().equals("oiContactEmail")) {
                    user.setEmail(attribute.getValues().get(0));
                } else if (attribute.getName().equals("axNamePersonFirstName")) {
                    user.setFirstName(attribute.getValues().get(0));
                } else if (attribute.getName().equals("axNamePersonLastName")) {
                    user.setLastName(attribute.getValues().get(0));
                }
            }
            if (log.isDebugEnabled()) {
                log.debug("Open ID user found = " + user);
            }
            user.setOpenIdToken(openIDToken.getIdentityUrl());
            userRepository.createUser(user);
        }
        return super.authenticate(authentication);
    }

    @Override
    @Inject
    public void setUserDetailsService(UserDetailsService userDetailsService) {
        super.setUserDetailsService(userDetailsService);
    }
}
