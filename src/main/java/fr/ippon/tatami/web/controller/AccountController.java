package fr.ippon.tatami.web.controller;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.UserService;

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
    public ModelAndView getUserProfile(@RequestParam(required = false) boolean success) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("Request to get account");
        }
        ModelAndView mv = basicModelAndView(success);
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
        User currentUser = this.authenticationService.getCurrentUser();

        currentUser.setFirstName(
                Jsoup.clean(updatedUser.getFirstName(), Whitelist.none()));

        currentUser.setLastName(
                Jsoup.clean(updatedUser.getLastName(), Whitelist.none()));

        currentUser.setJobTitle(
                Jsoup.clean(updatedUser.getJobTitle(), Whitelist.none()));

        currentUser.setPhoneNumber(
                Jsoup.clean(updatedUser.getPhoneNumber(), Whitelist.none()));

        try {
            this.userService.updateUser(currentUser);
        } catch (ConstraintViolationException cve) {
            return "redirect:/tatami/account?error=true";
        }
        if (this.log.isDebugEnabled()) {
            this.log.debug("User updated : " + currentUser);
        }
        return "redirect:/tatami/account?success=true";
    }

    @RequestMapping(value = "/account/suppress",
            method = RequestMethod.POST)
    public String suppressUserProfile() {
        User currentUser = this.authenticationService.getCurrentUser();
        if (this.log.isDebugEnabled()) {
            this.log.debug("Suppression du compte utilisateur : " + currentUser);
        }
        this.userService.deleteUser(currentUser);
        return "redirect:/tatami/logout";
    }

    /**
     * Common code for all "GET" requests.
     */
    private ModelAndView basicModelAndView(boolean success) {
        ModelAndView mv = new ModelAndView();
        User currentUser = this.authenticationService.getCurrentUser();
        User user = this.userService.getUserByLogin(currentUser.getLogin());
        mv.addObject("user", user);
        mv.addObject("success", success);
        return mv;
    }
}
