/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package fr.ippon.tatami.web.syndic;

import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.StatusUpdateService;
import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.dto.StatusDTO;
import java.util.Collection;
import javax.inject.Inject;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

/**
 *
 * @author tksh1670
 */
@Controller
public class SyndicTimelineController {
    private final Log log = LogFactory.getLog(fr.ippon.tatami.web.rest.TimelineController.class);

    @Inject
    private TimelineService timelineService;

    @Inject
    private StatusUpdateService statusUpdateService;

    @Inject
    private GroupService groupService;    
    
    
    /**
     * GET  /statuses/user_timeline?screen_name=jdubois -> get the latest statuses from user "jdubois"
     */
    @RequestMapping(value = "/syndic/statuses/user_timeline",
            method = RequestMethod.GET,
            produces = "application/rss+xml")
    @ResponseBody
    public ModelAndView listStatusForUser(@RequestParam("screen_name") String username,
                                                @RequestParam(required = false) Integer count,
                                                @RequestParam(required = false) String since_id,
                                                @RequestParam(required = false) String max_id) {

        if (count == null || count == 0) {
            count = 20; //Default value
        }
        if (log.isDebugEnabled()) {
            log.debug("REST request to get someone's status (username=" + username + ").");
        }
        Collection<StatusDTO> statuses  = timelineService.getUserline(username, count, since_id, max_id);
        
        ModelAndView mav = new ModelAndView("syndicView");
        mav.addObject("feedContent", statuses);
        return mav;
        
    }
    
}
