package fr.ippon.tatami.bot;

import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import fr.ippon.tatami.bot.processor.TatamiStatusProcessor;
import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.Domain;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.repository.TatamibotConfigurationRepository;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.builder.xml.XPathBuilder;
import org.apache.camel.model.ProcessorDefinition;
import org.apache.camel.spi.IdempotentRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.joda.time.DateTime;
import org.springframework.stereotype.Component;

import javax.inject.Inject;

/**
 * The Tatami Robot.
 */
@Component
public class Tatamibot extends RouteBuilder {

    private static final Log log = LogFactory.getLog(Tatamibot.class);

    @Inject
    private TatamiStatusProcessor tatamiStatusProcessor;

    @Inject
    private IdempotentRepository idempotentRepository;

    @Inject
    private DomainRepository domainRepository;

    @Inject
    private TatamibotConfigurationRepository tatamibotConfigurationRepository;

    @Inject
    private UserService userService;

    public void configure() {
        
        // TODO : essayer d'inclure la nouvelle console de monitoring Camel (basé sur hawtio)

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
                
                ProcessorDefinition pd = null;
                if (configuration.getType().equals(TatamibotConfiguration.TatamibotType.RSS)) {
                    log.debug("Configuring RSS support");
                    pd = from("rss:" +
                            configuration.getUrl() +
                            (configuration.getUrl().contains("?")?"&":"?") + "lastUpdate=" +
                            configuration.getISOLastUpdateDate() +
                            "&consumer.delay=" +
                            configuration.getPollingDelay()*1000 + // !!! *1000 !
                            "&throttleEntries=false").
                            marshal().rss().
                            setBody(XPathBuilder.xpath("concat('[', /rss/channel/item/title/text(), '](', /rss/channel/item/link/text(), ')')", String.class)).
                            setHeader("login", simple(tatamiBotLogin)).
                            setHeader("tatamibotConfigurationId", simple(configuration.getTatamibotConfigurationId())).
                            idempotentConsumer(simple(domain.getName() + "-${body}"), idempotentRepository);

                } else if (configuration.getType().equals(TatamibotConfiguration.TatamibotType.TWITTER)) {
                    log.debug("Configuring Twitter support");
                    /*
                    from("twitter://timeline/user?user=" +
                            twitterUser +
                            "&type=polling&delay=60&consumerKey=" +
                            twitterConsumerKey +
                            "&consumerSecret=" +
                            twitterConsumerSecret +
                            "&accessToken=" +
                            twitterAccessToken +
                            "&accessTokenSecret=" +
                            twitterAccessTokenSecret).
                            idempotentConsumer(body(), idempotentRepository).
                            transform(body().append(" #Twitter #TatamiBot")).
                            process(tatamiStatusProcessor);
                    */
                } else if (configuration.getType().equals(TatamibotConfiguration.TatamibotType.GIT)) {
                    log.debug("Configuring Github support");
                    //https://github.com/eclipse/egit-github/tree/master/org.eclipse.egit.github.core
                }
                if (pd != null) {
                    // Add a tag to the status
                    if (configuration.getTag() != null && !configuration.getTag().equals("")) {
                        pd = pd.transform(body().append(" #" + configuration.getTag()));
                    }
                    pd.process(tatamiStatusProcessor);

                }
            }
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
