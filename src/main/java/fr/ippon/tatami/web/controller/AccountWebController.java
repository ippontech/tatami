package fr.ippon.tatami.web.controller;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.google.common.base.Optional;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.UserService;

/**
 * @author Julien Dubois
 */
@Controller
public class AccountWebController {

    private final Logger log = LoggerFactory.getLogger(AccountWebController.class);

    @Inject
    private UserService userService;

    @Inject
    private AuthenticationService authenticationService;

    @RequestMapping(value = {"/account", "/account/**"},
            method = RequestMethod.GET)
    public ModelAndView getUserProfile() {
        log.debug("Request to get account");
        ModelAndView mv = basicModelAndView();
        mv.setViewName("account");
        return mv;
    }

    /**
     * Common code for all "GET" requests.
     */
    private ModelAndView basicModelAndView() {
        ModelAndView mv = new ModelAndView();
        User currentUser = authenticationService.getCurrentUser();
        String login = currentUser.getLogin();
        Optional<User> userByLogin = userService.getUserByLogin(login);
        if (userByLogin.isPresent()) {
            mv.addObject("user", userByLogin.get());
        } else {
            log.warn("Rendering basic model and view with unknown user: ", login);
        }
        return mv;
    }
}
