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
 * REST controller for getting the mention line.
 *
 * @author Julien Dubois
 */
@Controller
public class MentionsController {

    private final Logger log = LoggerFactory.getLogger(MentionsController.class);

    @Inject
    private TimelineService timelineService;

    /**
     * GET  /mentions -> get the mentions for the current user
     */
    @RequestMapping(value = "/rest/mentions",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<StatusDTO> listMentionStatus(@RequestParam(required = false) Integer count,
                                                   @RequestParam(required = false) String start,
                                                   @RequestParam(required = false) String finish) {

        if (count == null) {
            count = 20;
        }
        try {
            return timelineService.getMentionline(count, start, finish);
        } catch (NumberFormatException e) {
            log.warn("Page size undefined ; sizing to default", e);
            return timelineService.getMentionline(20, start, finish);
        }
    }
}
