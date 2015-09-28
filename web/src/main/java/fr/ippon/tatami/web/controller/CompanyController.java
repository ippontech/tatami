package fr.ippon.tatami.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author Julien Dubois
 */
@Controller
public class CompanyController {

    @RequestMapping(value = "/company",
            method = RequestMethod.GET)
    public ModelAndView adminPage(@RequestParam(required = false) String message) {
        return new ModelAndView("company");
    }
}
