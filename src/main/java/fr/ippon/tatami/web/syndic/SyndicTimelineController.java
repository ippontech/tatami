/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package fr.ippon.tatami.web.syndic;

import fr.ippon.tatami.service.TimelineService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.dto.StatusDTO;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;
import java.util.Collection;
import java.util.Locale;

/**
 * @author Pierre Rust
 */
@Controller
public class SyndicTimelineController {

    private final Log log = LogFactory.getLog(SyndicTimelineController.class);

    @Inject
    private TimelineService timelineService;

    @Inject
    private UserService userService;

    @Inject
    private MessageSource messageSource;

    /**
     * GET  /syndic/{rssUid} -> get the latest statuses from user username
     * corresponding to the uid
     */
    @RequestMapping(value = "/syndic/{rssUid}",
            method = RequestMethod.GET,
            produces = "application/rss+xml")
    @ResponseBody
    public ModelAndView listStatusForUser(@PathVariable String rssUid) {

        String login = userService.getLoginByRssUid(rssUid);

        if (login == null) {
            throw new UnknownRssChannelException("Could not find requested rss channel");
        }
        int count = 20; //Default value

        if (log.isDebugEnabled()) {
            log.debug("RSS request to get someone's status (login=" + login + ").");
        }
        Collection<StatusDTO> statuses = timelineService.getUserTimeline(login, count, null, null);

        ModelAndView mav = new ModelAndView("syndicView");

        //  i18n
        Locale locale = LocaleContextHolder.getLocale();
        Object[] params = {login};
        String feedTitle = messageSource.getMessage("tatami.rss.timeline.title", params, locale);
        String feedDesc = messageSource.getMessage("tatami.rss.timeline.description", params, locale);

        mav.addObject("feedTitle", feedTitle);
        mav.addObject("feedDescription", feedDesc);
        mav.addObject("statusBaseLink", "/tatami/profile/");

        // the link must point the actual content and not to the rss channel
        mav.addObject("feedLink", "/tatami/");
        mav.addObject("feedContent", statuses);

        return mav;
    }
}
