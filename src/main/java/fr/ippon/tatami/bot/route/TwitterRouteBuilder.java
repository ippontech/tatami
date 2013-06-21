package fr.ippon.tatami.bot.route;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//@Component ==> disabling component scanning as we create instances of this builder programmatically
public class TwitterRouteBuilder extends SourceRouteBuilderBase {

    private static final Logger log = LoggerFactory.getLogger(TwitterRouteBuilder.class);

    @Override
    public void configure() {

        log.debug("Configuring a Twitter support for domain {}", configuration.getDomain());

        from(getTwitterEndpointUri()).
                id("twitter-" + configuration.getDomain()).
                setHeader("login", simple(tatamiBotLogin)).
                setHeader("tatamibotConfiguration", constant(configuration)).
                // extraction of publishedDate ?
//            setHeader("tatamibotLastUpdateDate", simple("xxxx")). 
                        idempotentConsumer(simple("${header.tatamibotConfiguration.domain}-${body}"), idempotentRepository).
                to("direct:toTatami");
    }

    String getTwitterEndpointUri() {

        // TODO : add a map field to TatamibotConfiguration ?
        String twitterUser = "?";
        String twitterConsumerKey = "?";
        String twitterConsumerSecret = "?";
        String twitterAccessToken = "?";
        String twitterAccessTokenSecret = "?";

        String twitterEndpointUrl = "twitter://timeline/user?user=" +
                twitterUser +
                "&type=polling&delay=60&consumerKey=" +
                twitterConsumerKey +
                "&consumerSecret=" +
                twitterConsumerSecret +
                "&accessToken=" +
                twitterAccessToken +
                "&accessTokenSecret=" +
                twitterAccessTokenSecret;

        return twitterEndpointUrl;
    }

}
