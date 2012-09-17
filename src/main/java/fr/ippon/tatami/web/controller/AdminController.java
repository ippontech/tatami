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
public class AdminController {

    private final Log log = LogFactory.getLog(AdminController.class);

    @Inject
    private AdminService adminService;

    @RequestMapping(value = "/admin",
            method = RequestMethod.GET)
    public ModelAndView adminPage(@RequestParam(required = false) String message) {
        Collection<Domain> domains = adminService.getAllDomains();
        Map<String, String> properties = adminService.getEnvProperties();
        ModelAndView mv = new ModelAndView("admin");
        mv.addObject("domains", domains);
        mv.addObject("properties", properties);
        mv.addObject("message", message);
        return mv;
    }

    @RequestMapping(value = "/admin/reindex",
            method = RequestMethod.POST)
    public String reindexElasticSearch() {
        adminService.rebuildIndex();
        return "redirect:/tatami/admin?message=reindex";
    }
}
