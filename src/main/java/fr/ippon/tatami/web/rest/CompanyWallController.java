package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Metered;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.dto.StatusDTO;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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

    private final Log log = LogFactory.getLog(CompanyWallController.class);

    @Inject
    private TimelineService timelineService;

    /**
     * GET  /company -> get the public statuses of the current company
     */
    @RequestMapping(value = "/rest/company",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Metered
    public Collection<StatusDTO> getCompanyWall(@RequestParam(required = false) Integer count,
                                                @RequestParam(required = false) String since_id,
                                                @RequestParam(required = false) String max_id) {

        if (count == null) {
            count = 20;
        }
        try {
            return timelineService.getDomainline(count, since_id, max_id);
        } catch (NumberFormatException e) {
            log.warn("Page size undefined ; sizing to default", e);
            return timelineService.getDomainline(20, since_id, max_id);
        }
    }
}
