package fr.ippon.tatami.controller;

import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

/**
 * Welcome page.
 *
 * @author Julien Dubois
 */
@Controller
public class TimeLineController {

    private final Log log = LogFactory.getLog(TimeLineController.class);

    @Inject
    private UserService userService;

    @RequestMapping("/timeline")
    public String welcome(HttpServletRequest request) {
        log.warn("User : " + userService.getUserByEmail(request.getRemoteUser()));
        return "timeline";
    }
}
