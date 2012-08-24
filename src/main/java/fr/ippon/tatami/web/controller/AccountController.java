package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.UserService;
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
    public ModelAndView getUserProfile(@RequestParam(required = false) boolean success) {
        if (log.isDebugEnabled()) {
            log.debug("Request to get account");
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
        User currentUser = authenticationService.getCurrentUser();
        currentUser.setFirstName(updatedUser.getFirstName());
        currentUser.setLastName(updatedUser.getLastName());
        currentUser.setJobTitle(updatedUser.getJobTitle());
        currentUser.setEmail(updatedUser.getEmail());
        currentUser.setPhoneNumber(updatedUser.getPhoneNumber());
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

    /**
     * Common code for all "GET" requests.
     */
    private ModelAndView basicModelAndView(boolean success) {
        ModelAndView mv = new ModelAndView();
        User currentUser = authenticationService.getCurrentUser();
        User user = userService.getUserByLogin(currentUser.getLogin());
        mv.addObject("user", user);
        mv.addObject("success", success);
        return mv;
    }
}
