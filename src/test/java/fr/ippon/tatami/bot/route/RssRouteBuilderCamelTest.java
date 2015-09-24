package fr.ippon.tatami.bot.route;

import com.google.common.collect.Lists;
import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import org.apache.camel.builder.AdviceWithRouteBuilder;
import org.joda.time.DateTime;
import org.junit.Test;

import java.util.List;

import static com.jayway.awaitility.Awaitility.await;
import static com.jayway.awaitility.Awaitility.to;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;

public class RssRouteBuilderCamelTest extends SourceRouteBuilderBaseCamelTest<RssRouteBuilder> {

    public RssRouteBuilderCamelTest() {
        super(RssRouteBuilder.class);
    }

    @Test
    public void testRssRoute() throws Exception {
        launchContext();

        await().untilCall(to(messages).size(), is(greaterThanOrEqualTo(3)));

        assertThat(messages, hasSize(3));
        assertThat(messages, // in order ...
                is(equalTo((List<String>) Lists.newArrayList(
                        "[Ippevent Mobilité – Applications mobiles – ouverture des inscriptions](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/GcJYERHTfoQ/)",
                        "[Business – Ippon Technologies acquiert Atomes et renforce son offre Cloud](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/wK-Y47WGZBQ/)",
                        "[Les Méthodes Agiles – Définition de l’Agilité](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/hSqyt1MCOoo/)"))));
    }

    // ---

    @Override
    protected void launchContext() throws Exception {
        String routeDefId = "rss-ippon.fr"; // spécifique rss
        context.getRouteDefinition(routeDefId).adviceWith(context, new AdviceWithRouteBuilder() {
            @Override
            public void configure() throws Exception {
                String originalUri = getOriginalRoute().getInputs().get(0).getUri();
                replaceFromWith(originalUri + "consumer.initialDelay=0");   // spécifique rss ??? 
            }
        });

        context.start(); // necessary because of isUseAdviceWith=true
    }

    @Override
    protected String getFirstMsgBody() {
        return "[Ippevent Mobilité – Applications mobiles – ouverture des inscriptions](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/GcJYERHTfoQ/)";
    }

    @Override
    protected TatamibotConfiguration getBotConfiguration() {
        final String fileUrl = this.getClass().getResource("rss.xml").toExternalForm(); // spécifique ...

        TatamibotConfiguration configuration = new TatamibotConfiguration();
        configuration.setTatamibotConfigurationId("TEST_CONFIG_ID");
        configuration.setType(TatamibotConfiguration.TatamibotType.RSS);     // spécifique ... mais pas utilisé ici
        configuration.setDomain("ippon.fr");
//        configuration.setUrl("http://feeds.feedburner.com/LeBlogDesExpertsJ2ee?format=xml");
        configuration.setUrl(fileUrl);
        configuration.setPollingDelay(60); // not used here
        configuration.setLastUpdateDate(DateTime.parse("2010-01-01T00:00:00").toDate());
        return configuration;
    }

}
