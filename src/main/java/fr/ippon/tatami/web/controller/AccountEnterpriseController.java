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
public class AccountEnterpriseController {

    private final Log log = LogFactory.getLog(AccountEnterpriseController.class);

    @Inject
    private UserService userService;

    @Inject
    private AuthenticationService authenticationService;

    @RequestMapping(value = "/account/enterprise",
            method = RequestMethod.GET)
    public ModelAndView getEnterprise(@RequestParam(required = false) boolean success) {

        ModelAndView mv = basicModelAndView(success);
        mv.setViewName("account/enterprise");
        mv.addObject("users", userService.getUsersForCurrentDomain());
        return mv;
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
