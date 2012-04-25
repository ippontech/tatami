/**
 * 
 */
package fr.ippon.tatami.web.rest;

import java.util.Collection;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.service.IndexService;
import fr.ippon.tatami.service.TimelineService;

/**
 * @author dmartin
 *
 */
@Controller
public class SearchController {

    private final Log log = LogFactory.getLog(SearchController.class);

	@Inject
	private IndexService indexService;

	@Inject
	private TimelineService timelineService;

    /**
     * GET  /search/?q=jdubois -> get the tweets where "jdubois" appears
     */
    @RequestMapping(value = "/rest/search",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Tweet> listTweetsForUser(@RequestParam(value="q", required = false) String q,
    		@RequestParam(value="page", required = false) Integer page,
    		@RequestParam(value="rpp", required = false) Integer rpp) {

    	if (q == null) {
    		q = "";
    	}

        if (page == null) {
            page = 0; //Default value
        }
        if (rpp == null || rpp.intValue() <= 0) {
            rpp = 20; //Default value
        }
        
        if (log.isDebugEnabled()) {
            log.debug("REST request to search tweets containing these words (" + q + ").");
        }
        
        final List<String> ids = indexService.search(Tweet.class, null, q, page, rpp);
        return timelineService.buildTweetsList(ids);
    }

}
