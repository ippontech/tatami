package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Timed;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.dto.StatusDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import java.util.Collection;

/**
 * REST controller for getting the company wall.
 *
 * @author Julien Dubois
 */
@Controller
public class CompanyWallController {

    private final Logger log = LoggerFactory.getLogger(CompanyWallController.class);

    @Inject
    private TimelineService timelineService;

    /**
     * GET  /company -> get the public statuses of the current company
     */
    @RequestMapping(value = "/rest/company",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<StatusDTO> getCompanyWall(@RequestParam(required = false) Integer count,
                                                @RequestParam(required = false) String start,
                                                @RequestParam(required = false) String finish) {

        if (count == null) {
            count = 20;
        }
        try {
            return timelineService.getDomainline(count, start, finish);
        } catch (NumberFormatException e) {
            log.warn("Page size undefined ; sizing to default", e);
            return timelineService.getDomainline(20, start, finish);
        }
    }
}
