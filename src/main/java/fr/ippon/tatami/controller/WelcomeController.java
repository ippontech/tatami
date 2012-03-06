package fr.ippon.tatami.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Welcome page.
 *
 * @author Julien Dubois
 */
@Controller
public class WelcomeController {

    private final Log log = LogFactory.getLog(WelcomeController.class);

    @RequestMapping("/welcome")
    public String welcome() {
        return "welcome";
    }
}
