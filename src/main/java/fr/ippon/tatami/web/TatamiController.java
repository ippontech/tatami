package fr.ippon.tatami.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Main tatami page.
 *
 * @author Julien Dubois
 */
@Controller
public class TatamiController {

    private final Log log = LogFactory.getLog(TatamiController.class);

    @RequestMapping("/login")
    public String welcome() {
        return "login";
    }

    @RequestMapping("/")
    public String tatami() {
        return "home";
    }

    @RequestMapping("/about")
    public String about() {
        return "about";
    }
}
