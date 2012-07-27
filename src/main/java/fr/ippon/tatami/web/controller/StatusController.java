package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.CounterService;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;

/**
 * @author Julien Dubois
 */
@Controller
public class StatusController {

    private final Log log = LogFactory.getLog(StatusController.class);

    @Inject
    private UserService userService;

    @Inject
    private CounterService counterService;

    @RequestMapping(value = "/profile/{username}/",
            method = RequestMethod.GET)
    public ModelAndView getUserProfile(@PathVariable("username") String username) {
        if (log.isDebugEnabled()) {
            log.debug("Request to get username : " + username);
        }
        ModelAndView mv = new ModelAndView("profile");
        User user = userService.getUserProfileByUsername(username);
        if (null != user) {
            mv.addObject("user", user);
            String login = user.getLogin();
            mv.addObject("followed", userService.isFollowed(login));
            mv.addObject("nbStatus", counterService.getNbStatus(login));
            mv.addObject("nbFollowed", counterService.getNbFollowed(login));
            mv.addObject("nbFollowers", counterService.getNbFollowers(login));
        }
        return mv;
    }
}
