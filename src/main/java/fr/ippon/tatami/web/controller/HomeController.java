package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;

/**
 * @author Julien Dubois
 */
@Controller
public class HomeController {

    private final Log log = LogFactory.getLog(HomeController.class);

    @Inject
    private UserService userService;

    @Inject
    private AuthenticationService authenticationService;

    @RequestMapping(value = "/")
    public ModelAndView home(@RequestParam(required = false) String tag, @RequestParam(required = false) String search) {
        ModelAndView mv = new ModelAndView("home");
        User currentUser = authenticationService.getCurrentUser();
        mv.addObject("user", currentUser);
        mv.addObject("authenticatedUsername", currentUser.getUsername());
        mv.addObject("tag", tag);
        mv.addObject("search", search);
        return mv;
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView login(@RequestParam(required = false) String action) {
        ModelAndView mv = new ModelAndView("login");
        mv.addObject("action", action);
        return mv;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public String register(@RequestParam String email) {
        email = email.toLowerCase();
        if (userService.getUserByLogin(email) != null) {
            return "redirect:/tatami/login?action=registerFailure";
        }
        User user = new User();
        user.setLogin(email);
        userService.registerUser(user);
        return "redirect:/tatami/login?action=register";
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public ModelAndView validateRegistration(@RequestParam String key) {
        ModelAndView mv = new ModelAndView("register");
        String login = userService.validateRegistration(key);
        mv.addObject("login", login);
        return mv;
    }

    @RequestMapping(value = "/lostpassword", method = RequestMethod.POST)
    public String lostpassword(@RequestParam String email) {
        email = email.toLowerCase();
        User user = userService.getUserByLogin(email);
        if (user == null) {
            return "redirect:/tatami/login?action=lostPasswordFailure";
        }
        userService.lostPassword(user);
        return "redirect:/tatami/login?action=lostPassword";
    }



    @RequestMapping(value = "/tos", method = RequestMethod.GET)
    public String termsOfService() {
        return "terms_of_service";
    }

    /**
     * This maps any GET request to /tatami/[subpath]
     * to the jsp named [subpath].jsp.
     *
     * It allows adding easily new pages with tatamiCustomization
     *
     * @param subPath
     */
    @RequestMapping(value = "/{subPath}", method = RequestMethod.GET)
    public String anyOtherSubPath(@PathVariable String subPath) {
        return subPath;
    }

}