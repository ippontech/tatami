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
 * REST controller for getting the mention line.
 *
 * @author Julien Dubois
 */
@Controller
public class MentionsController {

    private final Log log = LogFactory.getLog(MentionsController.class);

    @Inject
    private TimelineService timelineService;

    /**
     * GET  /mentions -> get the mentions for the current user
     */
    @RequestMapping(value = "/rest/mentions",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Metered
    public Collection<StatusDTO> listMentionStatus(@RequestParam(required = false) Integer count,
                                                   @RequestParam(required = false) String since_id,
                                                   @RequestParam(required = false) String max_id) {

        if (count == null) {
            count = 20;
        }
        try {
            return timelineService.getMentionline(count, since_id, max_id);
        } catch (NumberFormatException e) {
            log.warn("Page size undefined ; sizing to default", e);
            return timelineService.getMentionline(20, since_id, max_id);
        }
    }
}
