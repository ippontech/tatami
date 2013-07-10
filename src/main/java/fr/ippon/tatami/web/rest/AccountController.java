package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Timed;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.Preferences;
import fr.ippon.tatami.web.rest.dto.UserPassword;
import org.apache.commons.lang.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolationException;

/**
 * REST controller for managing users.
 *
 * @author Arthur Weber
 */
@Controller
public class AccountController {

    private final Logger log = LoggerFactory.getLogger(AccountController.class);

    @Inject
    private UserService userService;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    Environment env;

    /**
     * GET  /account/profile -> get account's profile
     */
    @RequestMapping(value = "/rest/account/profile",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public User getProfile() {
        this.log.debug("REST request to get account's profile");
        User currentUser = authenticationService.getCurrentUser();
        return userService.getUserByLogin(currentUser.getLogin());
    }

    /**
     * PUT  /account/profile -> get account's profile
     */
    @RequestMapping(value = "/rest/account/profile",
            method = RequestMethod.PUT)
    @ResponseBody
    @Timed
    public User updateUserProfile(@RequestBody User updatedUser, HttpServletResponse response) {
        User currentUser = authenticationService.getCurrentUser();
        currentUser.setFirstName(updatedUser.getFirstName().replace("<", " "));
        currentUser.setLastName(updatedUser.getLastName().replace("<", " "));
        currentUser.setJobTitle(StringEscapeUtils.escapeHtml(updatedUser.getJobTitle().replace("<", " ")));
        currentUser.setPhoneNumber(updatedUser.getPhoneNumber().replace("<", " "));
        try {
            userService.updateUser(currentUser);
        } catch (ConstraintViolationException cve) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return null;
        }
        log.debug("User updated : {}", currentUser);
        return currentUser;
    }

    @RequestMapping(value = "/rest/account/profile",
            method = RequestMethod.DELETE)
    @Timed
    public void suppressUserProfile() {
        User currentUser = authenticationService.getCurrentUser();
        log.debug("Suppression du compte utilisateur : {}", currentUser);
        userService.deleteUser(currentUser);
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
        this.log.debug("REST request to get account's preferences");
        User currentUser = authenticationService.getCurrentUser();
        User user = userService.getUserByLogin(currentUser.getLogin());

        Preferences preferences = new Preferences(user);
        return preferences;
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
        this.log.debug("REST request to set account's preferences");
        Preferences preferences = null;
        try {
            User currentUser = authenticationService.getCurrentUser();
            currentUser.setPreferencesMentionEmail(newPreferences.getMentionEmail());
            currentUser.setDailyDigestSubscription(newPreferences.getDailyDigest());
            currentUser.setWeeklyDigestSubscription(newPreferences.getWeeklyDigest());

            String rssUid = userService.updateRssTimelinePreferences(newPreferences.getRssUidActive());
            currentUser.setRssUid(rssUid);

            preferences = new Preferences(currentUser);

            userService.updateUser(currentUser);
            userService.updateDailyDigestRegistration(newPreferences.getDailyDigest());
            userService.updateWeeklyDigestRegistration(newPreferences.getWeeklyDigest());

            org.springframework.security.core.userdetails.User securityUser =
                    (org.springframework.security.core.userdetails.User)
                            SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(securityUser,
                            securityUser.getPassword(),
                            securityUser.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.debug("User updated : {}", currentUser);
        } catch (Exception e) {
            log.debug("Error during setting preferences", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } finally {
            return preferences;
        }
    }


    /**
     * GET  /account/password -> throws an error if the password is managed by LDAP
     */
    @RequestMapping(value = "/rest/account/password",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public UserPassword isPasswordManagedByLDAP(HttpServletResponse response) {
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        if (userService.isDomainHandledByLDAP(domain)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return null;
        } else {
            return new UserPassword();
        }
    }

    /**
     * GET  /account/preferences -> get account's preferences
     */
    @RequestMapping(value = "/rest/account/password",
            method = RequestMethod.POST,
            produces = "application/json")
    @ResponseBody
    @Timed
    public UserPassword setPassword(@RequestBody UserPassword userPassword, HttpServletResponse response) {
        this.log.debug("REST request to set account's password");
        try {
            User currentUser = authenticationService.getCurrentUser();
            StandardPasswordEncoder encoder = new StandardPasswordEncoder();

            if (!encoder.matches(userPassword.getOldPassword(), currentUser.getPassword())) {
                log.debug("The old password is incorrect : {}", userPassword.getOldPassword());
                throw new Exception("oldPassword");
            }

            if (!userPassword.getNewPassword().equals(userPassword.getNewPasswordConfirmation())) {
                throw new Exception("newPasswordConfirmation");
            }

            currentUser.setPassword(userPassword.getNewPassword());

            userService.updatePassword(currentUser);

            log.debug("User password updated : {}", currentUser);
            return new UserPassword();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return null;
        }
    }
}
