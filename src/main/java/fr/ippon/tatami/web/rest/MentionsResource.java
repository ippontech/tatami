package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.web.rest.dto.StatusDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.Collection;

/**
 * REST controller for getting the mention line.
 *
 * @author Julien Dubois
 */
@RestController
@RequestMapping("/tatami")
public class MentionsResource {

    private final Logger log = LoggerFactory.getLogger(MentionsResource.class);

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
