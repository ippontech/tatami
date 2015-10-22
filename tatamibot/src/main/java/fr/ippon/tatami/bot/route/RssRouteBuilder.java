package fr.ippon.tatami.bot.route;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//@Component // ==> disabling component scanning as we create instances of this builder programmatically
//@Scope("prototype") // <<<===  TODO : configure it with Spring !! using prototype scope : WARN testability ! 
public class RssRouteBuilder extends SourceRouteBuilderBase {

    private static final Logger log = LoggerFactory.getLogger(RssRouteBuilder.class);

    @Override
    public void configure() {

        log.debug("Configuring a RSS support for domain {}", configuration.getDomain());

        from(getRssEndpointUri()). // return a single SyndFeed each time (with a single SyndEntry)
                id("rss-" + configuration.getDomain()).
                transform(simple("[${body.entries[0].title}](${body.entries[0].link})")).
                setHeader("login", simple(tatamiBotLogin)).
                setHeader("tatamibotConfiguration", constant(configuration)).
                // extraction of publishedDate  TODO : in original code the date was put through JodaTime : why ???
                        setHeader("tatamibotLastUpdateDate", simple("header.CamelRssFeed.publishedDate")).
                idempotentConsumer(simple("${header.tatamibotConfiguration.domain}-${body}"), idempotentRepository).
                to("direct:toTatami");
    }

    /* pp */ String getRssEndpointUri() {
        return "rss:" +
                configuration.getUrl() +
                (configuration.getUrl().contains("?") ? "&" : "?") + "lastUpdate=" +
                configuration.getISOLastUpdateDate() +
                "&consumer.delay=" +
                configuration.getPollingDelay() * 1000 +
                "&throttleEntries=false";
    }

}
