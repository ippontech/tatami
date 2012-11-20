package fr.ippon.tatami.web.controller;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.UserService;

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

    @RequestMapping(value = "/account/tags_directory",
            method = RequestMethod.GET)
    public ModelAndView getStatusOfTheDay() {

        ModelAndView mv = new ModelAndView("tags_directory");
        return mv;
    }
}
