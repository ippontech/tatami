package fr.ippon.tatami.web.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Julien Dubois
 */
@Controller
public class ErrorController {

    private final Log log = LogFactory.getLog(ErrorController.class);

    @RequestMapping(value = "/errors/404")
    public String pageNotFound(HttpServletRequest request) {
        if (log.isDebugEnabled()) {
            log.debug("404 error : " + request.getAttribute("javax.servlet.forward.request_uri"));
        }
        return "errors/404";
    }

    @RequestMapping(value = "/errors/500")
    public String internalServerError(HttpServletRequest request) {
        if (log.isDebugEnabled()) {
            log.debug("500 error !");
        }
        return "errors/500";
    }
}
