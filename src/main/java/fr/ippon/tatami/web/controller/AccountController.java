package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.web.controller.form.UserPassword;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;

/**
 * @author Julien Dubois
 */
@Controller
public class AccountController {

    private final Log log = LogFactory.getLog(AccountController.class);

    @Inject
    private UserService userService;

    @Inject
    private AuthenticationService authenticationService;

    @RequestMapping(value = "/account",
            method = RequestMethod.GET)
    public ModelAndView getUserProfile(@RequestParam(required = false) boolean success,
                                       @RequestParam(required = false) boolean error) {
        if (log.isDebugEnabled()) {
            log.debug("Request to get account");
        }
        ModelAndView mv = basicModelAndView(success, error);
        mv.setViewName("account");
        return mv;
    }


    @RequestMapping(value = "/account",
            method = RequestMethod.POST)
    public String updateUserProfile(@ModelAttribute("user")
                                    User updatedUser, BindingResult result) {
        if (result.hasErrors()) {
            return "redirect:/tatami/account?error=true";
        }
        User currentUser = authenticationService.getCurrentUser();
        currentUser.setFirstName(updatedUser.getFirstName());
        currentUser.setLastName(updatedUser.getLastName());
        try {
            userService.updateUser(currentUser);
        } catch (ConstraintViolationException cve) {
            return "redirect:/tatami/account?error=true";
        }
        if (log.isDebugEnabled()) {
            log.debug("User updated : " + currentUser);
        }
        return "redirect:/tatami/account?success=true";
    }

    @RequestMapping(value = "/account/suppress",
            method = RequestMethod.POST)
    public String suppressUserProfile() {
        User currentUser = authenticationService.getCurrentUser();
        if (log.isDebugEnabled()) {
            log.debug("Suppression du compte utilisateur : " + currentUser);
        }
        userService.deleteUser(currentUser);
        return "redirect:/tatami/logout";
    }

    @RequestMapping(value = "/account/password",
            method = RequestMethod.GET)
    public ModelAndView getUpdatePassword(@RequestParam(required = false) boolean success,
                                          @RequestParam(required = false) boolean error) {

        ModelAndView mv = basicModelAndView(success, error);
        mv.addObject("userPassword", new UserPassword());
        mv.setViewName("account/password");
        return mv;
    }

    @RequestMapping(value = "/account/password",
            method = RequestMethod.POST)
    public String updatePassword(@ModelAttribute("userPassword")
                                 UserPassword userPassword, BindingResult result) {

        User currentUser = authenticationService.getCurrentUser();
        if (!currentUser.getPassword().equals(userPassword.getOldPassword())) {
            result.reject("oldPassword");
        }
        if (!userPassword.getNewPassword().equals(userPassword.getNewPasswordConfirmation())) {
            result.reject("newPasswordConfirmation");
        }
        if (result.hasErrors()) {
            return "redirect:/tatami/account/password?error=true";
        }

        currentUser.setPassword(userPassword.getNewPassword());
        try {
            userService.updateUser(currentUser);
        } catch (ConstraintViolationException cve) {
            return "redirect:/tatami/account/password?error=true";
        }
        if (log.isDebugEnabled()) {
            log.debug("User password updated : " + currentUser);
        }
        return "redirect:/tatami/account/password?success=true";
    }

    @RequestMapping(value = "/account/enterprise",
            method = RequestMethod.GET)
    public ModelAndView getEnterprise(@RequestParam(required = false) boolean success,
                                      @RequestParam(required = false) boolean error) {

        ModelAndView mv = basicModelAndView(success, error);
        mv.setViewName("account/enterprise");
        mv.addObject("users", userService.getUsersForCurrentDomain());
        return mv;
    }

    /**
     * Common code for all "GET" requests.
     */
    private ModelAndView basicModelAndView(boolean success, boolean error) {
        ModelAndView mv = new ModelAndView();
        User currentUser = authenticationService.getCurrentUser();
        User user = userService.getUserByLogin(currentUser.getLogin());
        mv.addObject("user", user);
        mv.addObject("success", success);
        mv.addObject("error", error);
        return mv;
    }
}
