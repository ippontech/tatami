package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;

@Controller
public class AccountTagsDirectoryController {

    @Inject
    private UserService userService;

    @Inject
    private AuthenticationService authenticationService;

    @ModelAttribute("user")
    public User initUser() {
        User currentUser = authenticationService.getCurrentUser();
        return userService.getUserByLogin(currentUser.getLogin());
    }

    @RequestMapping(value = "/account/tags/directory/",
            method = RequestMethod.GET)
    public ModelAndView getTagDirectory() {

        ModelAndView mv = new ModelAndView("account_tags");
        return mv;
    }

    @RequestMapping(value = "/account/tags/popular/",
            method = RequestMethod.GET)
    public ModelAndView getPopularTags() {

        ModelAndView mv = new ModelAndView("popular_tags");
        return mv;
    }
}
