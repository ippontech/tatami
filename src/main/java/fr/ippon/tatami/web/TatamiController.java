package fr.ippon.tatami.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Main tatami page.
 *
 * @author Julien Dubois
 */
@Controller
public class TatamiController {

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
