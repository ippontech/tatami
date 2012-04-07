package fr.ippon.tatami.web.rest;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.ippon.tatami.service.CounterService;

/**
 * REST controller for managing counters.
 *
 * @author Julien Dubois
 */
@Controller
public class CounterController {

	private final Log log = LogFactory.getLog(CounterController.class);

	@Inject
	private CounterService counterService;

	@RequestMapping(value = "/rest/counters/theMostPopularUser",
			method = RequestMethod.GET,
			produces = "application/json")
	@ResponseBody
	public String getTheMostPopularUser() {
		log.debug("REST request to get the most popular user : ");
		return counterService.getTheMostPopularUser();
	}
}
