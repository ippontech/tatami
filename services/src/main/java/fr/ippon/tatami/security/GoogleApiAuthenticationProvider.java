package fr.ippon.tatami.security;

import org.pac4j.springframework.security.authentication.ClientAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;

public class GoogleApiAuthenticationProvider implements AuthenticationProvider {

    Logger logger = LoggerFactory.getLogger(GoogleApiAuthenticationProvider.class);

    @Override
    public Authentication authenticate(Authentication authentication) {
        if(!this.supports(authentication.getClass())) {
            logger.debug("unsupported authentication class : {}", authentication.getClass());
            return null;
        } else {
            logger.debug("authentication : {}", authentication);

            GoogleAuthenticationToken result = (GoogleAuthenticationToken) authentication;
            result.setDetails(authentication.getDetails());
            return result;
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return GoogleAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
