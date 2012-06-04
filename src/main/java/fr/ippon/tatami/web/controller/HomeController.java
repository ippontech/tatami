package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;

/**
 * @author dmartin
 */
@Controller
public class HomeController {

    @Inject
    private UserService userService;

    @RequestMapping(value = "/")
    public ModelAndView home(@RequestParam(required = false) String tag, @RequestParam(required = false) String search) {
        ModelAndView mv = new ModelAndView("home");
        User currentUser = userService.getCurrentUser();
        mv.addObject("user", currentUser);
        mv.addObject("tag", tag);
        mv.addObject("search", search);
        return mv;
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login() {
        return "login";
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public String register(@RequestParam String email) {

        userService.registerEmail(email);
        return "redirect:/tatami/login";
    }
}
