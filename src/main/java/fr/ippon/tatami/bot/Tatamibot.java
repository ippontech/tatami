package fr.ippon.tatami.bot;

import java.util.Date;

import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import fr.ippon.tatami.bot.processor.LastUpdateDateTatamibotConfigurationUpdater;
import fr.ippon.tatami.bot.processor.TatamiStatusProcessor;
import fr.ippon.tatami.bot.route.GitHubRouteBuilder;
import fr.ippon.tatami.bot.route.RssRouteBuilder;
import fr.ippon.tatami.bot.route.SourceRouteBuilderBase;
import fr.ippon.tatami.bot.route.TwitterRouteBuilder;
import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.Domain;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.repository.TatamibotConfigurationRepository;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;

import org.apache.camel.Exchange;
import org.apache.camel.Expression;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.RoutesBuilder;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.builder.xml.XPathBuilder;
import org.apache.camel.model.ProcessorDefinition;
import org.apache.camel.spi.IdempotentRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.joda.time.DateTime;
import org.springframework.stereotype.Component;

import com.sun.syndication.feed.synd.SyndFeedImpl;

import javax.inject.Inject;

/**
 * The Tatami Robot.
 */
@Component
public class Tatamibot extends RouteBuilder {

    private static final Log log = LogFactory.getLog(Tatamibot.class);


    @Inject
    private IdempotentRepository<String> idempotentRepository;

    @Inject
    private DomainRepository domainRepository;

    @Inject
    private TatamibotConfigurationRepository tatamibotConfigurationRepository;

    @Inject
    private UserService userService;

    @Override
    public void configure() {
        
        log.info("Configuring the Tatami Bot");
        for (Domain domain : domainRepository.getAllDomains()) {
            if (log.isDebugEnabled()) {
                log.debug("Configuring Bot for domain " + domain.getName());
            }
            String tatamiBotLogin = getTatamiBotLogin(domain);
            
            for (TatamibotConfiguration configuration :
                    tatamibotConfigurationRepository.findTatamibotConfigurationsByDomain(domain.getName())) {

                if (log.isDebugEnabled()) {
                    log.debug("Configuring Bot : " + configuration);
                }
                
                SourceRouteBuilderBase subBuilder = null;
                if (configuration.getType().equals(TatamibotConfiguration.TatamibotType.RSS)) {
                    subBuilder = new RssRouteBuilder();
                  
                } else if (configuration.getType().equals(TatamibotConfiguration.TatamibotType.TWITTER)) {
                    subBuilder = new TwitterRouteBuilder();
                
                } else if (configuration.getType().equals(TatamibotConfiguration.TatamibotType.GIT)) {
                    subBuilder = new GitHubRouteBuilder();
                }

                if(subBuilder != null) {
                    subBuilder.setConfiguration(configuration);
                    subBuilder.setTatamiBotLogin(tatamiBotLogin);
                    subBuilder.setIdempotentRepository(idempotentRepository);
                    addRoutesToContext(subBuilder);
                }
            }
        }
    }

    private void addRoutesToContext(RouteBuilder builder) {
        try {
            getContext().addRoutes(builder);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error when configuring a route",e);
        }
    }

    private String getTatamiBotLogin(Domain domain) {
        String tatamiBotLogin = DomainUtil.getLoginFromUsernameAndDomain(Constants.TATAMIBOT_NAME, domain.getName());
        automaticBotCreation(domain, tatamiBotLogin);
        return tatamiBotLogin;
    }

    private void automaticBotCreation(Domain domain, String tatamiBotLogin) {
        if (userService.getUserByLogin(tatamiBotLogin) == null) {
            log.info("Tatami Bot user does not exist for domain " + domain.getName() + " - creating it");
            userService.createTatamibot(domain.getName());
            if (domain.getName().equals("ippon.fr")) {
                log.info("Creating a default RSS robot for ippon.fr");
                TatamibotConfiguration configuration = new TatamibotConfiguration();
                configuration.setType(TatamibotConfiguration.TatamibotType.RSS);
                configuration.setDomain("ippon.fr");
                configuration.setUrl("http://feeds.feedburner.com/LeBlogDesExpertsJ2ee?format=xml");
                configuration.setPollingDelay(60);
                DateTime lastUpdateDate = DateTime.parse("2013-01-01T00:00:00");
                configuration.setLastUpdateDate(lastUpdateDate.toDate());
                configuration.setTag("BlogIppon");
                tatamibotConfigurationRepository.insertTatamibotConfiguration(configuration);
            }
        }
    }
}
