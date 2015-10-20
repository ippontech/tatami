package fr.ippon.tatami.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Julien Dubois
 */
@Controller
public class ErrorController {

    private final Logger log = LoggerFactory.getLogger(ErrorController.class);

    @RequestMapping(value = "/errors/404")
    public String pageNotFound(HttpServletRequest request) {
        log.debug("404 error : {}", request.getAttribute("javax.servlet.forward.request_uri"));
        return "errors/404";
    }

    @RequestMapping(value = "/errors/500")
    public String internalServerError(HttpServletRequest request) {
        log.debug("500 error !");
        return "errors/500";
    }
}
