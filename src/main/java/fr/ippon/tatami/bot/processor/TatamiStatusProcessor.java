package fr.ippon.tatami.bot.processor;

import java.util.Date;

import com.sun.syndication.feed.synd.SyndFeedImpl;
import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.TatamibotConfigurationRepository;
import fr.ippon.tatami.service.StatusUpdateService;
import fr.ippon.tatami.service.UserService;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.joda.time.DateTime;
import org.springframework.stereotype.Component;

import javax.inject.Inject;

@Component
public class TatamiStatusProcessor implements Processor {

    private final Log log = LogFactory.getLog(TatamiStatusProcessor.class);

    @Inject
    private StatusUpdateService statusUpdateService;

    @Inject
    private UserService userService;

    @Inject
    private TatamibotConfigurationRepository tatamibotConfigurationRepository;

    @Override
    public void process(Exchange exchange) throws Exception {
        sendTatam(exchange);

        // TODO : move to rss route ...
        SyndFeedImpl feed = (SyndFeedImpl) exchange.getIn().getHeader("CamelRssFeed");
        DateTime lastUpdateDateJoda = new DateTime(feed.getPublishedDate());
        Date lastUpdateDate = lastUpdateDateJoda.toDate();
        
        // TODO : move to another Procesor
        String tatamibotConfigurationId = (String) exchange.getIn().getHeader("tatamibotConfigurationId");
        TatamibotConfiguration tatamibotConfiguration =
                tatamibotConfigurationRepository.findTatamibotConfigurationById(tatamibotConfigurationId);

        tatamibotConfiguration.setLastUpdateDate(lastUpdateDate);
        tatamibotConfigurationRepository.updateTatamibotConfiguration(tatamibotConfiguration);
    }

    private void sendTatam(Exchange exchange) {
        String content = exchange.getIn().getBody(String.class);
        String login = exchange.getIn().getHeader("login").toString();
        User tatamiBotUser = userService.getUserByLogin(login);
        if (log.isDebugEnabled()) {
            log.debug("Posting content to Tatami : " + content);
        }
        statusUpdateService.postStatusAsUser(content, tatamiBotUser);
    }
}
