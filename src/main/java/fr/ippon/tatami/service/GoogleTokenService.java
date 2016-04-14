package fr.ippon.tatami.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.plus.Plus;
import com.google.api.services.plus.model.Person;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.RssUidRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.GoogleAuthenticationToken;
import fr.ippon.tatami.security.xauth.Token;
import fr.ippon.tatami.security.xauth.TokenProvider;
import fr.ippon.tatami.security.xauth.XAuthTokenFilter;
import fr.ippon.tatami.service.util.RandomUtil;
import org.apache.commons.lang.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.TreeSet;


/**
 * Created by jacob on 3/24/16.
 */
@Service
public class GoogleTokenService {

    @Inject
    private AuthenticationManager authenticationManager;

    @Inject
    private TokenProvider tokenProvider;

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserDetailsService DetailsService;

    @Inject
    private RssUidRepository rssUidRepository;

    @Inject
    private Environment env;



    private static final Logger log = LoggerFactory.getLogger(GoogleTokenService.class);

    public Token getGoogleUser (HttpServletRequest request){
        HttpServletRequest httpServletRequest = request;
         String[] url = httpServletRequest.getQueryString().split("code=");
         String authorizationCode = url[1];
        //String authorizationCode = httpServletRequest.getHeader(XAuthTokenFilter.XAUTH_TOKEN_HEADER_NAME);

        Token authToken = null;
        if(StringUtils.hasText(authorizationCode))
        {
            try{
                Person user = getGooglePerson(authorizationCode);
                UserDetails userDetails = getUserDetails(user);
                GoogleAuthenticationToken googleToken = new GoogleAuthenticationToken(userDetails);
                authToken = tokenProvider.createToken(userDetails);
                Authentication authentication = authenticationManager.authenticate(googleToken);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (IOException e){
                log.error("{}",e);
            }
        }
        log.debug("{}",authToken.getToken());
        return authToken;
    }
    private Person getGooglePerson(String authorizationCode) throws IOException{
        String clientId = env.getProperty("jhipster.google.clientId");
        String clientSecret = env.getProperty("jhipster.google.clientSecret");

        HttpTransport transport = new NetHttpTransport();
        JacksonFactory jacksonFactory = new JacksonFactory();

        GoogleAuthorizationCodeTokenRequest googleRequest = new GoogleAuthorizationCodeTokenRequest(transport, jacksonFactory, clientId, clientSecret, authorizationCode, "http://localhost:8080/tatami/rest/oauth/token");
        GoogleTokenResponse googleTokenResponse = googleRequest.execute();

        GoogleCredential credential = new GoogleCredential.Builder()
            .setJsonFactory(jacksonFactory)
            .setTransport(transport)
            .setClientSecrets(clientId,clientSecret)
            .build()
            .setFromTokenResponse(googleTokenResponse);

        Plus plus = new Plus.Builder(transport,jacksonFactory,credential)
            .setApplicationName("tatami")
            .build();

        return plus.people().get("me").execute();

    }

    private UserDetails getUserDetails(Person user) throws UsernameNotFoundException {
        String login = user.getEmails().get(0).getValue();

        if(login == null) {
            String msg = "OAuth response did not contain the user email";
            log.error(msg);
            throw new UsernameNotFoundException(msg);
        }

        if(!login.contains("@")) {
            log.debug("User login {} from OAuth response is incorrect.", login);
            throw new UsernameNotFoundException("OAuth response did not contains a valid user email");
        }

        UserDetails userDetails;
        try {
            userDetails = DetailsService.loadUserByUsername(login);
        } catch (UsernameNotFoundException e) {
            log.info("User with login : \"{}\" doesn't exist yet in Tatami database - creating it...", login);
            userDetails = getNewlyCreatedUserDetails(user);
        }
        return userDetails;
    }

    private UserDetails getNewlyCreatedUserDetails(Person user) {
        String login = user.getEmails().get(0).getValue();
        String id = user.getId();
        String firstName = user.getName().getGivenName();
        String lastName = user.getName().getFamilyName();

        User createdUser = new User();

        createdUser.setLogin(login);
        createdUser.setId(id);
        createdUser.setEmail(login);
        createdUser.setFirstName(firstName);
        createdUser.setLastName(lastName);
        createdUser.setActivated(true);
        createdUser.setRssUid(rssUidRepository.generateRssUid(login));
        createdUser.setDailyDigest(false);//arbitrary values for email notification on ser creation
        createdUser.setWeeklyDigest(true);
        createdUser.setMentionEmail(false);
        createdUser.setJobTitle("Not Set Yet");
        createdUser.setPhoneNumber("Not Set Yet");
        createdUser.setLangKey(user.getLanguage());

        TreeSet<String> authorities = new TreeSet<>();
        authorities.add("ROLE_USER");
        createdUser.setAuthorities(authorities);

        RandomUtil randomUtil = new RandomUtil();
        String password = randomUtil.generatePassword();
        createdUser.setPassword(password);

        String activation = randomUtil.generateActivationKey();
        createdUser.setActivationKey(activation);

        String domain = login.split("@")[1];
        createdUser.setDomain(domain);

        userRepository.save(createdUser);
        return DetailsService.loadUserByUsername(createdUser.getLogin());
    }
}
