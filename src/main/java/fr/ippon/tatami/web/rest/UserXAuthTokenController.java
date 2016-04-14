package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.plus.Plus;
import com.google.api.services.plus.model.Person;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.GoogleAuthenticationToken;
import fr.ippon.tatami.security.xauth.Token;
import fr.ippon.tatami.security.xauth.TokenProvider;
import fr.ippon.tatami.security.xauth.XAuthTokenFilter;
import fr.ippon.tatami.service.GoogleTokenService;
import org.apache.commons.lang.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.ws.Response;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collection;


@RestController
@RequestMapping("/tatami")
public class UserXAuthTokenController {

    private static final Logger log = LoggerFactory.getLogger(UserXAuthTokenController.class);

    @Inject
    private TokenProvider tokenProvider;

    @Inject
    private UserRepository userRepository;

    @Inject
    private AuthenticationManager authenticationManager;

    @Inject
    private UserDetailsService userDetailsService;

    @Inject
    private HttpServletRequest servletRequest;

    @Inject
    private Environment env;

    @Inject
    private GoogleTokenService googleTokenService;

    /*@RequestMapping(value = "rest/client/id",
            method = RequestMethod.GET,
            produces = "application/json")

    @Timed
    public Collection<String> getClientId(){
        String clientId = env.getProperty("jhipster.google.clientId");
                Collection<String> clientList = new ArrayList<String>();
                clientList.add(clientId);
                return clientList;
    }*/

    @RequestMapping(value = "rest/builder",
        method = RequestMethod.GET)
    public void redirectUser(HttpServletResponse response){
        String clientId = env.getProperty("jhipster.google.clientId");
        response.setHeader("Access-Control-Allow-Headers","*");
        //response.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
        String url = "https://accounts.google.com/o/oauth2/v2/auth?client_id="+clientId+"&redirect_uri=http://localhost:8080/tatami/rest/oauth/token&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&approval_prompt=force&response_type=code&access_type=offline";
        try {
            //response.setStatus(HttpServletResponse.SC_OK);
            response.sendRedirect(response.encodeRedirectURL(url));
            //response.flushBuffer();
            return;
        }catch(IOException e)
        {
            log.debug("{}",e);
        }
    }


    @RequestMapping(value = "rest/oauth/token",
            method = RequestMethod.GET)
    @Timed
    public void doGoogleStuff(HttpServletRequest request, HttpServletResponse response){
        Token authToken = googleTokenService.getGoogleUser(request);
        //Cookie authCookie = new Cookie("googleAuthToken", authToken.getToken());
        try{
            //response.addCookie(authCookie);
            response.sendRedirect("/#/login?Token="+authToken.getToken());
        }catch(IOException e){
            log.debug("{}",e);
        }
        return;
    }
    @RequestMapping(value = "/authenticate",
        method = RequestMethod.POST)

    @Timed
    public Token authorize(@RequestParam String username, @RequestParam String password) {

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password);
        Authentication authentication = this.authenticationManager.authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails details = this.userDetailsService.loadUserByUsername(username);
        return tokenProvider.createToken(details);
    }
}
