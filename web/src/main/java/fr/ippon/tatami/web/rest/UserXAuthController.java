package fr.ippon.tatami.web.rest;

import com.google.api.client.auth.oauth2.AuthorizationCodeFlow;
import com.google.api.client.auth.oauth2.AuthorizationCodeTokenRequest;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.BasicAuthentication;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.yammer.metrics.annotation.Timed;
import fr.ippon.tatami.security.xauth.XAuthTokenFilter;
import fr.ippon.tatami.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.inject.Inject;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Controller
public class UserXAuthController {

    private static final Logger log = LoggerFactory.getLogger(UserXAuthController.class);

    @Inject
    private UserService userService;

    @Inject
    Environment env;

    /**
     * POST /rest/oauth/token -> Gets a token based on the users google information
     */
    @RequestMapping(value = "/rest/oauth/token",
            method = RequestMethod.POST)
    @Timed
    public void getGoogleUser(ServletRequest servletRequest) {
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        String authorizationCode = httpServletRequest.getHeader(XAuthTokenFilter.XAUTH_TOKEN_HEADER_NAME);

        String clientId = env.getProperty("tatami.google.clientId");
        String clientSecret = env.getProperty("tatami.google.clientSecret");

        if(StringUtils.hasText(authorizationCode)){
            log.debug("Google authorization code: {}", authorizationCode);

            try {
                String accessCode = new GoogleAuthorizationCodeTokenRequest(new NetHttpTransport(), new JacksonFactory(),
                        env.getProperty("tatami.google.clientId"),
                        env.getProperty("tatami.google.clientSecret"), authorizationCode, "http://localhost/callback")
                        .execute()
                        .getAccessToken();

                log.debug("Got an access code from google: {}", accessCode);

            } catch (IOException ioe) {
                return;
            }
        }
    }
}
