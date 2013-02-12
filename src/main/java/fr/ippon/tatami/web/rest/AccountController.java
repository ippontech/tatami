package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.security.TatamiUserDetails;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.controller.form.Preferences;
import fr.ippon.tatami.web.controller.form.UserPassword;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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

    private final Log log = LogFactory.getLog(AccountController.class);

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
    public User getProfile() {
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to get account's profile");
        }
        User currentUser = authenticationService.getCurrentUser();
        User user = userService.getUserByLogin(currentUser.getLogin());
        return user;
    }

    @RequestMapping(value = "/rest/account/profile",
            method = RequestMethod.PUT)
    @ResponseBody
    public User updateUserProfile(@RequestBody User updatedUser, HttpServletResponse response) {
        User currentUser = authenticationService.getCurrentUser();
        currentUser.setFirstName(updatedUser.getFirstName().replace("<", " "));
        currentUser.setLastName(updatedUser.getLastName().replace("<", " "));
        currentUser.setJobTitle(updatedUser.getJobTitle().replace("<", " "));
        currentUser.setPhoneNumber(updatedUser.getPhoneNumber().replace("<", " "));
        try {
            userService.updateUser(currentUser);
        } catch (ConstraintViolationException cve) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return null;
        }
        if (log.isDebugEnabled()) {
            log.debug("User updated : " + currentUser);
        }
        return currentUser;
    }

    @RequestMapping(value = "/rest/account/profile",
            method = RequestMethod.DELETE)
    public void suppressUserProfile() {
        User currentUser = authenticationService.getCurrentUser();
        if (log.isDebugEnabled()) {
            log.debug("Suppression du compte utilisateur : " + currentUser);
        }
        userService.deleteUser(currentUser);
    }


    /**
     * GET  /account/preferences -> get account's preferences
     */
    @RequestMapping(value = "/rest/account/preferences",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Preferences getPreferences() {
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to get account's preferences");
        }
        User currentUser = authenticationService.getCurrentUser();
        User user = userService.getUserByLogin(currentUser.getLogin());

        Preferences preferences = new Preferences(user);
        String themes = env.getProperty("tatami.authorized.theme");
        preferences.setThemesList(themes);

        return preferences;
    }

    /**
     * POST  /account/preferences -> update account's preferences
     */
    @RequestMapping(value = "/rest/account/preferences",
            method = RequestMethod.POST,
            produces = "application/json")
    @ResponseBody
    public Preferences updatePreferences(@RequestBody Preferences newPreferences, HttpServletResponse response) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to set account's preferences");
        }
        Preferences preferences = null;
        try {
            User currentUser = authenticationService.getCurrentUser();
            if (newPreferences.getTheme().isEmpty()) {
                throw new Exception("Theme can't be null");
            }
            currentUser.setTheme((String) newPreferences.getTheme());
            currentUser.setPreferencesMentionEmail((Boolean) newPreferences.getMentionEmail());
            currentUser.setDailyDigestSubscription((Boolean) newPreferences.getDailyDigest());
            currentUser.setWeeklyDigestSubscription((Boolean) newPreferences.getWeeklyDigest());

            String rssUid = userService.updateRssTimelinePreferences(newPreferences.getRssUidActive());
            currentUser.setRssUid(rssUid);

            preferences = new Preferences(currentUser);

            userService.updateUser(currentUser);
            userService.updateDailyDigestRegistration(newPreferences.getDailyDigest());
            userService.updateWeeklyDigestRegistration(newPreferences.getWeeklyDigest());

            userService.updateThemePreferences(newPreferences.getTheme());
            TatamiUserDetails userDetails =
                    (TatamiUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            userDetails.setTheme(newPreferences.getTheme());
            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(userDetails,
                            userDetails.getPassword(),
                            userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);

            if (log.isDebugEnabled()) {
                log.debug("User updated : " + currentUser);
            }
        } catch (Exception e) {
            log.debug("Error during setting preferences", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } finally {
            String themes = env.getProperty("tatami.authorized.theme");
            preferences.setThemesList(themes);
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
    public void isPasswordManagedByLDAP(HttpServletResponse response) {
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        if (userService.isDomainHandledByLDAP(domain)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        }
    }

    /**
     * GET  /account/preferences -> get account's preferences
     */
    @RequestMapping(value = "/rest/account/password",
            method = RequestMethod.POST,
            produces = "application/json")
    @ResponseBody
    public String setPreferences(@RequestBody UserPassword userPassword, HttpServletResponse response) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to set account's password");
        }
        try {
            User currentUser = authenticationService.getCurrentUser();
            StandardPasswordEncoder encoder = new StandardPasswordEncoder();

            if (!encoder.matches(userPassword.getOldPassword(), currentUser.getPassword())) {
                if (log.isDebugEnabled()) {
                    log.debug("The old password is incorrect : " + userPassword.getOldPassword());
                }
                throw new Exception("oldPassword");
            }

            if (!userPassword.getNewPassword().equals(userPassword.getNewPasswordConfirmation())) {
                throw new Exception("newPasswordConfirmation");
            }

            currentUser.setPassword(userPassword.getNewPassword());

            userService.updatePassword(currentUser);

            if (log.isDebugEnabled()) {
                log.debug("User password updated : " + currentUser);
            }
            return null;
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return e.getMessage();
        }
    }

    /**
     * GET  /visit -> Get all users of domain
     */
    @RequestMapping(value = "/rest/visit",
            method = RequestMethod.DELETE,
            produces = "application/json")
    @ResponseBody
    public void finish() {
        User currentUser = authenticationService.getCurrentUser();
        currentUser.setIsNew(false);
        userService.updateUser(currentUser);
    }
}
