package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;
import java.util.List;

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

    @ModelAttribute("user")
    public User initUser() {
        User currentUser = authenticationService.getCurrentUser();
        return userService.getUserByLogin(currentUser.getLogin());
    }

    @RequestMapping(value = "/account/enterprise",
            method = RequestMethod.GET)
    public ModelAndView getEnterprise(@RequestParam(required = false) Integer pagination) {
        if (pagination == null) {
            pagination = 0;
        }
        ModelAndView mv = new ModelAndView("account_enterprise");
        List<User> users = userService.getUsersForCurrentDomain(pagination);
        if (pagination > 0) {
            mv.addObject("paginationPrevious", pagination - Constants.PAGINATION_SIZE);
        }
        if (users.size() > Constants.PAGINATION_SIZE) {
            mv.addObject("paginationNext", pagination + Constants.PAGINATION_SIZE);
            users.remove(users.size() - 1);
        }
        mv.addObject("users", users);
        return mv;
    }
}
