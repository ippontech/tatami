package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.plus.Plus;
import com.google.api.services.plus.model.Person;
import fr.ippon.tatami.config.JHipsterProperties;
import fr.ippon.tatami.security.AuthoritiesConstants;
import fr.ippon.tatami.security.GoogleAuthenticationToken;
import fr.ippon.tatami.security.xauth.Token;
import fr.ippon.tatami.security.xauth.TokenProvider;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.web.rest.dto.ManagedUserDTO;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;


@RestController
@RequestMapping("/tatami")
public class XAuthResource {

    private static final Logger log = LoggerFactory.getLogger(XAuthResource.class);

    private static final String GOOGLE_AUTH_CODE_HEADER_NAME = "x-auth-code-header";

    @Inject
    private TokenProvider tokenProvider;

    @Inject
    private AuthenticationManager authenticationManager;

    @Inject
    private UserDetailsService userDetailsService;

    @Inject
    private UserService userService;

    @Inject
    private JHipsterProperties jHipsterProperties;

    private List<String> adminUsers;

    private Set<String> userGrantedAuthorities = new HashSet<>();
    private Set<String> adminGrantedAuthorities = new HashSet<>();

    @PostConstruct
    private void init() {
        // Roles for "normal" users
        userGrantedAuthorities.add(AuthoritiesConstants.USER);

        // Roles for "admin" users, configured in application.yml
        adminGrantedAuthorities.add(AuthoritiesConstants.USER);
        adminGrantedAuthorities.add(AuthoritiesConstants.ADMIN);

        String[] adminUsersArray = StringUtils.split(jHipsterProperties.getTatami().getAdmins(), ",");
        adminUsers = new ArrayList<>(Arrays.asList(adminUsersArray));
        for (String admin : adminUsers) {
            log.debug("Initialization : user \"{}\" is an administrator", admin);
        }
    }

    @RequestMapping(value = "callback",
        method = RequestMethod.GET)
    @Timed
    public RedirectView callback(@RequestParam String code) throws JSONException {
        Token token = getToken(code);
        return new RedirectView("/#/login?token=" + token.getToken() + "&expires=" + token.getExpires());
    }

    @RequestMapping(value = "rest/client/id",
        method = RequestMethod.GET,
        produces = "application/json")
    @Timed
    public JSONObject getClientId() throws JSONException {
        return new JSONObject().put("clientId", jHipsterProperties.getGoogle().getClientId());
    }

    @RequestMapping(value = "rest/builder",
        method = RequestMethod.GET)
    @Timed
    public RedirectView redirectUser(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Headers", "*");
        String url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + jHipsterProperties.getGoogle().getClientId() + "&redirect_uri=" + jHipsterProperties.getGoogle().getCallbackURI() + "&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&approval_prompt=force&response_type=code&access_type=offline";
        return new RedirectView(url);
    }

    /**
     * POST /rest/oauth/token -> Gets a token based on the users google information
     */
    @RequestMapping(value = "/rest/oauth/token",
        method = RequestMethod.POST)
    @Timed
    public JSONObject getGoogleUser(@RequestHeader(GOOGLE_AUTH_CODE_HEADER_NAME) String authorizationCode) throws JSONException {
        return new JSONObject().put("token", getToken(authorizationCode));
    }

    @RequestMapping(value = "/authentication",
        method = RequestMethod.POST)
    @Timed
    public Token authorize(@RequestParam String j_username, @RequestParam String j_password) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(j_username, j_password);
        Authentication authentication = this.authenticationManager.authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails details = this.userDetailsService.loadUserByUsername(j_username);
        return tokenProvider.createToken(details);
    }

    private Token getToken(String authorizationCode) {
        Token authToken = null;
        if (StringUtils.isNotBlank(authorizationCode)) {
            try {
                Person user = getGoogleUserInfo(authorizationCode);
                UserDetails userDetails = getUserDetails(user);
                GoogleAuthenticationToken token = new GoogleAuthenticationToken(userDetails);
                authToken = tokenProvider.createToken(userDetails);
                Authentication authentication = authenticationManager.authenticate(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (IOException ioe) {
                log.error("Exception retrieving Google's user information", ioe);
            }
        }
        return authToken;
    }

    private Person getGoogleUserInfo(String authorizationCode) throws IOException {
        HttpTransport transport = new NetHttpTransport();
        JacksonFactory jacksonFactory = new JacksonFactory();

        TokenResponse accessCode = new GoogleAuthorizationCodeTokenRequest(transport, jacksonFactory,
            jHipsterProperties.getGoogle().getClientId(), jHipsterProperties.getGoogle().getClientSecret(), authorizationCode, jHipsterProperties.getGoogle().getCallbackURI()).execute();
        log.info("URL : {}", accessCode.toString());
        GoogleCredential googleCredential = new GoogleCredential.Builder()
            .setJsonFactory(new JacksonFactory())
            .setTransport(transport)
            .setClientSecrets(jHipsterProperties.getGoogle().getClientId(), jHipsterProperties.getGoogle().getClientSecret())
            .build()
            .setFromTokenResponse(accessCode);

        Plus plus = new Plus.Builder(transport, jacksonFactory, googleCredential)
            .setApplicationName("Tatami")
            .build();
        return plus.people().get("me").execute();
    }

    private UserDetails getUserDetails(Person user) throws UsernameNotFoundException {
        String login = user.getEmails().get(0).getValue();

        if (StringUtils.isBlank(login)) {
            throw new UsernameNotFoundException("OAuth response did not contain the user email");
        }

        if (!login.contains("@")) {
            throw new UsernameNotFoundException("OAuth response did not contains a valid user email (" + login + ")");
        }

        try {
            return userDetailsService.loadUserByUsername(login);
        } catch (UsernameNotFoundException e) {
            log.info("User with login : \"{}\" doesn't exist yet in Tatami database - creating it...", login);
            return createUserFromGoogleAuth(user);
        }
    }

    private UserDetails createUserFromGoogleAuth(Person user) {
        String login = user.getEmails().get(0).getValue();
        String firstName = user.getName().getGivenName();
        String lastName = user.getName().getFamilyName();

        ManagedUserDTO createdUser = new ManagedUserDTO();
        createdUser.setUsername(login);
        createdUser.setFirstName(firstName);
        createdUser.setLastName(lastName);
        createdUser.setEmail(login);
        createdUser.setAuthorities(adminUsers.contains(login) ? adminGrantedAuthorities : userGrantedAuthorities);
        userService.createUser(createdUser);

        return userDetailsService.loadUserByUsername(createdUser.getUsername());
    }
}
