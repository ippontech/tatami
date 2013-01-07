package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;

/**
 * @author Julien Dubois
 */
@Controller
public class AccountWebController {

    private final Log log = LogFactory.getLog(AccountWebController.class);

    @Inject
    private UserService userService;

    @Inject
    private AuthenticationService authenticationService;

    @RequestMapping(value = "/account",
            method = RequestMethod.GET)
    public ModelAndView getUserProfile() {
        if (log.isDebugEnabled()) {
            log.debug("Request to get account");
        }
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
        User user = userService.getUserByLogin(currentUser.getLogin());
        mv.addObject("user", user);
        return mv;
    }
}
