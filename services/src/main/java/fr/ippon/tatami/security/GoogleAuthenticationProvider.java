package fr.ippon.tatami.security;

import com.google.inject.Inject;
import org.pac4j.core.client.Client;
import org.pac4j.core.client.Clients;
import org.pac4j.core.context.WebContext;
import org.pac4j.core.credentials.Credentials;
import org.pac4j.core.profile.UserProfile;
import org.pac4j.springframework.security.authentication.ClientAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

/**
 *
 */
public class GoogleAuthenticationProvider implements AuthenticationProvider {
    private static final Logger logger = LoggerFactory.getLogger(GoogleAuthenticationProvider.class);

    // In our case, the only actual client is the google client
    @Inject
    private Clients clients;

    // Get/Create new user
    @Inject
    private AuthenticationUserDetailsService<ClientAuthenticationToken> userDetailsService;

    public GoogleAuthenticationProvider() {

    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        logger.debug("authentication : {}", authentication);
        if(!this.supports(authentication.getClass())) {
            logger.debug("unsupported authentication class : {}", authentication.getClass());
            return null;
        } else {
            ClientAuthenticationToken token = (ClientAuthenticationToken)authentication;
            Credentials credentials = (Credentials)authentication.getCredentials();
            logger.debug("credentials : {}", credentials);
            String clientName = token.getClientName();
            Client client = this.clients.findClient(clientName);
            UserProfile userProfile = client.getUserProfile(credentials, (WebContext)null);
            logger.debug("userProfile : {}", userProfile);
            Object authorities = new ArrayList();
            ClientAuthenticationToken result = null;
            logger.debug("userDetailsService: {}", this.userDetailsService);
            result = new ClientAuthenticationToken(credentials, clientName, userProfile, (Collection)null);
            UserDetails userDetails = this.userDetailsService.loadUserDetails(result);
            logger.debug("userDetails : {}", userDetails);
            if(userDetails != null) {
                authorities = userDetails.getAuthorities();
                logger.debug("authorities : {}", authorities);
            }
            GoogleAuthenticationToken res = new GoogleAuthenticationToken(userDetails, clientName, (Collection)authorities);


            logger.debug("Client name : {}", clientName); // -> Google2Client
            logger.debug("Client Credentials: {}", credentials); // -> OAuth Credentials
            logger.debug("Client Profile: {}", userProfile); // -> GoogleProfile, i.e. data from google
            res.setDetails(authentication.getDetails());
            logger.debug("result : {}", res);
            return res;
        }
    }

    public UserDetails createPrincipal() {
        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return ClientAuthenticationToken.class.isAssignableFrom(authentication);
    }

    public void setUserDetailsService(AuthenticationUserDetailsService<ClientAuthenticationToken> userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    public AuthenticationUserDetailsService<ClientAuthenticationToken> getUserDetailsService() {
        return this.userDetailsService;
    }

    public void setClients(Clients clients) {
        this.clients = clients;
    }
    public Clients getClients() {
        return clients;
    }
}
