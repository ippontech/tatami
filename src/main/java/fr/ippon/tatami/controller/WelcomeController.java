package fr.ippon.tatami.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Welcome page.
 *
 * @author Julien Dubois
 */
@Controller
@RequestMapping("/welcome")
public class WelcomeController {

    public String welcome() {
        return "welcome";
    }
}
