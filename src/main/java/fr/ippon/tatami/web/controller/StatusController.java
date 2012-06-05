package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.CounterService;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @RequestMapping(value = "/{login}/status/{statusId}")
    public ModelAndView displayStatus(@PathVariable("login") String login, @PathVariable("statusId") String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("Request to get Status ID : " + statusId);
        }
        ModelAndView mv = new ModelAndView();
        mv.setViewName("status");
        User user = userService.getUserProfileByUsername(login);
        if (null != user) {
            mv.addObject("statusId", statusId);
            mv.addObject("user", user);
            mv.addObject("followed", userService.isFollowed(login));
            mv.addObject("nbStatus", counterService.getNbStatus(login));
            mv.addObject("nbFollowed", counterService.getNbFollowed(login));
            mv.addObject("nbFollowers", counterService.getNbFollowers(login));
        }
        return mv;
    }
}
