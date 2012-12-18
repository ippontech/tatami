package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.SearchService;
import fr.ippon.tatami.service.SuggestionService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.controller.form.UserPassword;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolationException;
import java.util.Collection;
import java.util.List;
import java.util.HashMap;

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
            response.setStatus(500);
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
    public HashMap<String, Object> getPreferences() {
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to get account's preferences");
        }
        User currentUser = authenticationService.getCurrentUser();
        User user = userService.getUserByLogin(currentUser.getLogin());

        HashMap<String, Object> preferences = new HashMap<String, Object>();

        preferences.put("theme", user.getTheme());
        preferences.put("mentionEmail", user.getPreferencesMentionEmail());

        return preferences;
    }

    /**
     * GET  /account/preferences -> get account's preferences
     */
    @RequestMapping(value = "/rest/account/preferences",
            method = RequestMethod.POST,
            produces = "application/json")
    @ResponseBody
    public HashMap<String, Object> setPreferences(@RequestBody HashMap<String, Object> newPreferences, HttpServletResponse response) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to set account's preferences");
        }
        HashMap<String, Object> preferences = null;
        try {

            User currentUser = authenticationService.getCurrentUser();
            if((String) newPreferences.get("theme") == ""){
                throw new Exception("Theme can't be null");
            }
            currentUser.setTheme((String) newPreferences.get("theme"));
            currentUser.setPreferencesMentionEmail((Boolean) newPreferences.get("mentionEmail"));

            this.log.debug(newPreferences.get("mentionEmail") + "" + (Boolean) newPreferences.get("mentionEmail"));
            preferences = new HashMap<String, Object>();

            preferences.put("theme", currentUser.getTheme());
            preferences.put("mentionEmail", currentUser.getPreferencesMentionEmail());

            userService.updateUser(currentUser);

            if (log.isDebugEnabled()) {
                log.debug("User updated : " + currentUser);
            }
        }
        catch (Exception e){
            this.log.debug("Error during setting preferences", e);
            response.setStatus(500);
        }
        finally {
            return preferences;
        }
    }


    /**
     * GET  /account/password
     */
    @RequestMapping(value = "/rest/account/password",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public void getPreferences(HttpServletResponse response) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("REST request to get account's password");
        }
        User currentUser = authenticationService.getCurrentUser();
        User user = userService.getUserByLogin(currentUser.getLogin());

        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());

        String domainHandledByLdap = env.getProperty("tatami.ldapauth.domain");

        if (domain.equalsIgnoreCase(domainHandledByLdap)) {
            response.setStatus(500);
        }

        return;
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
        HashMap<String, Object> preferences = null;
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
        }
        catch (Exception e){
            response.setStatus(500);
            return e.getMessage();
        }
    }
}
