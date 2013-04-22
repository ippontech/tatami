package fr.ippon.tatami.web.bot;

import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.TatamibotConfigurationRepository;
import fr.ippon.tatami.security.AuthenticationService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import java.util.Collection;

/**
 * @author Julien Dubois
 */
@Controller
public class TatamibotController {

    private final Log log = LogFactory.getLog(TatamibotController.class);

    @Inject
    private TatamibotConfigurationRepository tatamibotConfigurationRepository;

    @Inject
    private AuthenticationService authenticationService;

    @RequestMapping(value = "/rest/tatamibot/configurations",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<TatamibotConfiguration> getConfigurations() {
        User currentUser = authenticationService.getCurrentUser();
        return tatamibotConfigurationRepository.findTatamibotConfigurationsByDomain(currentUser.getDomain());
    }
}
