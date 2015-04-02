package fr.ippon.tatami.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class Pac4JSecurityCheckController {	
    @RequestMapping(value = "/j_spring_pac4j_security_check")
    public String googleCheck() {
        return "redirect:/#/home";
    }

}
