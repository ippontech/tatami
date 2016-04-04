package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.MailService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.web.rest.dto.KeyAndPasswordDTO;
import fr.ippon.tatami.web.rest.dto.Preferences;
import fr.ippon.tatami.web.rest.dto.UserDTO;
import fr.ippon.tatami.web.rest.dto.UserPassword;
import fr.ippon.tatami.web.rest.util.HeaderUtil;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.StandardPasswordEncoder;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.*;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/tatami")
public class AccountResource {

    private final Logger log = LoggerFactory.getLogger(AccountResource.class);

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserService userService;

    @Inject
    private MailService mailService;

    @Inject
    private PasswordEncoder passwordEncoder;



    /**
     * POST  /register -> register the user.
     */
    @RequestMapping(value = "/register",
        method = RequestMethod.POST,
        produces = MediaType.TEXT_PLAIN_VALUE)
    @Timed
    public ResponseEntity<?> registerAccount(@Valid @RequestBody UserDTO userDTO, HttpServletRequest request) {
        return userRepository.findOneByUsername(userDTO.getUsername())
            .map(user -> new ResponseEntity<>("login already in use", HttpStatus.BAD_REQUEST))
            .orElseGet(() -> userRepository.findOneByEmail(userDTO.getEmail())
                .map(user -> new ResponseEntity<>("e-mail address already in use", HttpStatus.BAD_REQUEST))
                .orElseGet(() -> {
                    User user = userService.createUserInformation(userDTO.getUsername(), userDTO.getPassword(),
                    userDTO.getFirstName(), userDTO.getLastName(), userDTO.getEmail().toLowerCase(),
                    userDTO.getLangKey(), userDTO.getJobTitle(), userDTO.getPhoneNumber(), userDTO.isMentionEmail(),
                    userDTO.getRssUid(), userDTO.isWeeklyDigest(), userDTO.isDailyDigest(), userDTO.getEmail().split("@")[1]);
                    String baseUrl = request.getScheme() + // "http"
                    "://" +                                // "://"
                    request.getServerName() +              // "myhost"
                    ":" +                                  // ":"
                    request.getServerPort() +              // "80"
                    request.getContextPath();              // "/myContextPath" or "" if deployed in root context

                    mailService.sendActivationEmail(user, baseUrl);
                    return new ResponseEntity<>(HttpStatus.CREATED);
                })
        );
    }

    /**
     * GET  /activate -> activate the registered user.
     */
    @RequestMapping(value = "/activate",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<String> activateAccount(@RequestParam(value = "key") String key) {
        return Optional.ofNullable(userService.activateRegistration(key))
            .map(user -> new ResponseEntity<String>(HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    /**
     * GET  /authenticate -> check if the user is authenticated, and return its login.
     */
    @RequestMapping(value = "/authenticate",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public String isAuthenticated(HttpServletRequest request) {
        log.debug("REST request to check if the current user is authenticated");
        return request.getRemoteUser();
    }

    /**
     * GET  /account -> get the current user.
     */
    @RequestMapping(value = "/rest/account/profile",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<UserDTO> getAccount() {
        return Optional.ofNullable(userService.getUserWithAuthorities())
            .map(user -> new ResponseEntity<>(new UserDTO(user), HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    /**
     * POST  /account -> update the current user information.
     */
    @RequestMapping(value = "/rest/account/profile",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<String> saveAccount(@RequestBody UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findOneByEmail(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getUsername().equalsIgnoreCase(userDTO.getUsername()))) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("user-management", "emailexists", "Email already in use")).body(null);
        }
        return userRepository
            .findOneByUsername(SecurityUtils.getCurrentUser().getUsername())
            .map(u -> {
                userService.updateUserInformation(userDTO.getFirstName(), userDTO.getLastName(), userDTO.getEmail(),
                    userDTO.getLangKey(), userDTO.getJobTitle(), userDTO.getPhoneNumber());
                return new ResponseEntity<String>(HttpStatus.OK);
            })
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    /**
     * POST  /change_password -> changes the current user's password
     */
    @RequestMapping(value = "/rest/account/change_password",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> changePassword(@RequestBody String password) {
        if (!checkPasswordLength(password)) {
            return new ResponseEntity<>("Incorrect password", HttpStatus.BAD_REQUEST);
        }
        userService.changePassword(password);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/rest/account/reset_password/init",
        method = RequestMethod.POST,
        produces = MediaType.TEXT_PLAIN_VALUE)
    @Timed
    public ResponseEntity<?> requestPasswordReset(@RequestBody String mail, HttpServletRequest request) {
        return userService.requestPasswordReset(mail)
            .map(user -> {
                String baseUrl = request.getScheme() +
                    "://" +
                    request.getServerName() +
                    ":" +
                    request.getServerPort() +
                    request.getContextPath();
                mailService.sendPasswordResetMail(user, baseUrl);
                return new ResponseEntity<>("e-mail was sent", HttpStatus.OK);
            }).orElse(new ResponseEntity<>("e-mail address not registered", HttpStatus.BAD_REQUEST));
    }

    @RequestMapping(value = "/rest/account/reset_password/finish",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<String> finishPasswordReset(@RequestBody KeyAndPasswordDTO keyAndPassword) {
        if (!checkPasswordLength(keyAndPassword.getNewPassword())) {
            return new ResponseEntity<>("Incorrect password", HttpStatus.BAD_REQUEST);
        }
        return userService.completePasswordReset(keyAndPassword.getNewPassword(), keyAndPassword.getKey())
              .map(user -> new ResponseEntity<String>(HttpStatus.OK)).orElse(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    private boolean checkPasswordLength(String password) {
        return (!StringUtils.isEmpty(password) &&
            password.length() >= UserDTO.PASSWORD_MIN_LENGTH &&
            password.length() <= UserDTO.PASSWORD_MAX_LENGTH);
    }

    /**
     * GET  /account/preferences -> get account's preferences
     */
    @RequestMapping(value = "/rest/account/preferences",
        method = RequestMethod.GET,
        produces = "application/json")
    @ResponseBody
    @Timed
    public Preferences getPreferences() {
        log.debug("REST request to get account's preferences");
        User currentUser = userRepository.findOneByUsername(SecurityUtils.getCurrentUser().getUsername()).get();

        return new Preferences(currentUser);
    }

    /**
     * POST  /account/preferences -> update account's preferences
     */
    @RequestMapping(value = "/rest/account/preferences",
        method = RequestMethod.POST,
        produces = "application/json")
    @ResponseBody
    @Timed
    public Preferences updatePreferences(@RequestBody Preferences newPreferences, HttpServletResponse response) {
        log.debug("REST request to set account's preferences");
        Preferences preferences = null;
        try {
            User currentUser = userRepository.findOneByUsername(SecurityUtils.getCurrentUser().getUsername()).get();
            currentUser.setMentionEmail(newPreferences.getMentionEmail());
            currentUser.setDailyDigest(newPreferences.getDailyDigest());
            currentUser.setWeeklyDigest(newPreferences.getWeeklyDigest());
            String rssUid = userService.updateRssTimelinePreferences(newPreferences.getRssUidActive());
            currentUser.setRssUid(rssUid);

            preferences = new Preferences(currentUser);

            userService.updateUserPreferences(preferences.getMentionEmail(), rssUid,
                preferences.getWeeklyDigest(), preferences.getDailyDigest());
            userService.updateDailyDigestRegistration(preferences.getDailyDigest());
            userService.updateWeeklyDigestRegistration(preferences.getWeeklyDigest());

            org.springframework.security.core.userdetails.User securityUser =
                (org.springframework.security.core.userdetails.User)
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            log.debug("User roles : {}", securityUser);

            Authentication authentication =
                new UsernamePasswordAuthenticationToken(securityUser,
                    securityUser.getPassword(),
                    securityUser.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.debug("User updated : {}", currentUser);
        } catch (Exception e) {
            log.debug("Error during setting preferences", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
        return preferences;

    }

    /**
     * GET  /account/password -> throws an error if the password is managed by LDAP
     */
//    @RequestMapping(value = "/rest/account/password",
//        method = RequestMethod.GET,
//        produces = "application/json")
//    @ResponseBody
//    @Timed
//    public UserPassword isPasswordManagedByLDAP(HttpServletResponse response) {
//        User currentUser = userRepository.findOneByUsername(SecurityUtils.getCurrentUser().getUsername()).get();
//        String domain = DomainUtil.getDomainFromUsername(currentUser.getUsername());
//        if (userService.isDomainHandledByLDAP(domain)) {
//            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//            return null;
//        } else {
//            return new UserPassword();
//        }
//    }

    /**
     * POST  /account/password -> change password
     */
    @RequestMapping(value = "/rest/account/password",
        method = RequestMethod.POST,
        produces = "application/json")
    @ResponseBody
    @Timed
    public UserPassword setPassword(@RequestBody UserPassword userPassword, HttpServletResponse response) {
        log.debug("REST request to set account's password");
        try {
            User currentUser = userRepository.findOneByUsername(SecurityUtils.getCurrentUser().getUsername()).get();
            StandardPasswordEncoder encoder = new StandardPasswordEncoder();

            if (!passwordEncoder.matches(userPassword.getOldPassword(), currentUser.getPassword())) {
                log.debug("The old password is incorrect : {}", userPassword.getOldPassword());
                throw new Exception("oldPassword");
            }

            if (!userPassword.getNewPassword().equals(userPassword.getNewPasswordConfirmation())) {
                log.debug("The passwords dont match : {}", userPassword.getOldPassword());
                throw new Exception("newPasswordConfirmation");
            }

            currentUser.setPassword(userPassword.getNewPassword());

            userService.changePassword(userPassword.getNewPassword());

            log.debug("User password updated : {}", currentUser);
            return new UserPassword();
        } catch (Exception e) {
            log.error(e.toString());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return null;
        }
    }

}
