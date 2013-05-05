package fr.ippon.tatami.bot.route;

import javax.inject.Inject;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.spi.IdempotentRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

//@Component ==> disabling component scanning as we create instances of this builder programmatically
public class TwitterRouteBuilder extends SourceRouteBuilderBase {

    private static final Log log = LogFactory.getLog(TwitterRouteBuilder.class);

    @Override
    public void configure() {

//        log.debug("Configuring a Twitter support for domain "+configuration.getDomain());
//        from(getTwitterEndpointUri()).id("twitter").
//            setHeader("login", simple(tatamiBotLogin)).
//            setHeader("tatamibotConfiguration", constant(configuration)).
//            // extraction of publishedDate  TODO : in original code the date was put through JodaTime : why ???
//            setHeader("tatamibotLastUpdateDate", simple("xxxx")). 
//            idempotentConsumer(simple("${header.tatamibotConfiguration.domain}-${body}"), idempotentRepository).
//            to("direct:toTatami");
    }

//    String getTwitterEndpointUri() {
//		String twitterEndpointUrl = "twitter://timeline/user?user=" +
//                twitterUser +
//                "&type=polling&delay=60&consumerKey=" +
//                twitterConsumerKey +
//                "&consumerSecret=" +
//                twitterConsumerSecret +
//                "&accessToken=" +
//                twitterAccessToken +
//                "&accessTokenSecret=" +
//                twitterAccessTokenSecret;
//	 	
//		return twitterEndpointUrl;
//	}

}
