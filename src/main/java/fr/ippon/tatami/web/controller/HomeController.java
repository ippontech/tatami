package fr.ippon.tatami.web.controller;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.UserService;

/**
 * @author dmartin
 *
 */
@Controller
public class HomeController {

    @Inject
    private UserService userService;
    
    @RequestMapping(value="/")
    public ModelAndView home(@RequestParam(required = false) String tag) {
        ModelAndView mv = new ModelAndView("home");
        User currentUser = userService.getCurrentUser();
        mv.addObject("user", currentUser);
        mv.addObject("tag", tag);
        return mv;
    }
}
