package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
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

    private final Logger log = LoggerFactory.getLogger(HomeController.class);

    @Inject
    private UserService userService;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private Environment env;

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView login(@RequestParam(required = false) String action) {
        ModelAndView mv = new ModelAndView("login");
        mv.addObject("action", action);
        return mv;
    }

    @RequestMapping(value = {"/", "/home/**", "/home", "/home/"}, method = RequestMethod.GET)
    public ModelAndView home(@RequestParam(required = false) String ios) {
        ModelAndView mv = new ModelAndView("home");
        User currentUser = authenticationService.getCurrentUser();
        mv.addObject("user", currentUser);
        if (ios == null) {
            mv.addObject("ios", false);
        } else {
            mv.addObject("ios", true);
        }
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

    @RequestMapping(value = "/register/automatic", method = RequestMethod.POST)
    public String automaticRegistration(@RequestParam String email, @RequestParam String password) {
        String enabled = env.getProperty("tatami.automatic.registration");
        if (enabled != null && !enabled.equals("true")) {
            log.warn("Automatic registration should not have been called.");
            return "redirect:/tatami/login";
        }
        if (email == null || email.equals("")) {
            return "redirect:/tatami/login";
        }
        email = email.toLowerCase();
        if (userService.getUserByLogin(email) != null) {
            log.debug("User {} already exists.", email);
            return "redirect:/tatami/login";
        }
        if (email.equals(Constants.TATAMIBOT_NAME)) {
            log.debug("E-mail {} can only be used by the Tatami Bot.", email);
            return "redirect:/tatami/login";
        }
        log.debug("Creating user {}", email);
        User user = new User();
        user.setLogin(email);
        StandardPasswordEncoder encoder = new StandardPasswordEncoder();
        String encryptedPassword = encoder.encode(password);
        user.setPassword(encryptedPassword);
        userService.createUser(user);
        return "redirect:/tatami/login";
    }

    @RequestMapping(value = "/lostpassword", method = RequestMethod.POST)
    public String lostPassword(@RequestParam String email) {
        email = email.toLowerCase();
        User user = userService.getUserByLogin(email);
        if (user == null) {
            return "redirect:/tatami/login?action=lostPasswordFailure";
        }
        if (userService.isDomainHandledByLDAP(user.getDomain())) {
            return "redirect:/tatami/login?action=ldapPasswordFailure";
        }
        userService.lostPassword(user);
        return "redirect:/tatami/login?action=lostPassword";
    }


    @RequestMapping(value = "/tos", method = RequestMethod.GET)
    public String termsOfService() {
        return "terms_of_service";
    }

    @RequestMapping(value = "/presentation", method = RequestMethod.GET)
    public String presentation() {
        return "presentation";
    }

    @RequestMapping(value = "/license", method = RequestMethod.GET)
    public String license() {
        return "license";
    }

    /**
     * This maps any GET request to /tatami/customization/[subpath]
     * to the jsp named /customization/[subpath].jsp.
     * <p/>
     * It allows adding easily new pages with tatamiCustomization
     */
    @RequestMapping(value = "/customization/{subPath}", method = RequestMethod.GET)
    public String anyOtherSubPath(@PathVariable String subPath) {
        return "/customization/" + subPath;
    }
}