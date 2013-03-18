package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.domain.Domain;
import fr.ippon.tatami.service.AdminService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;
import java.util.Collection;
import java.util.Map;

/**
 * @author Julien Dubois
 */
@Controller
public class CompanyController {

    private final Log log = LogFactory.getLog(CompanyController.class);

    @RequestMapping(value = "/company",
            method = RequestMethod.GET)
    public ModelAndView adminPage(@RequestParam(required = false) String message) {
        ModelAndView mv = new ModelAndView("company");
        return mv;
    }
}
