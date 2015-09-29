package fr.ippon.tatami.bot.route;

import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import org.joda.time.DateTime;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;

public class RssRouteBuilderUnitTest {

    private static final Logger log = LoggerFactory.getLogger(RssRouteBuilderUnitTest.class);

    RssRouteBuilder sut = new RssRouteBuilder();

    @Test
    public void getRssEndpointUri_handlesUrlWithParameters() {
        sut.setConfiguration(getRssBotConfiguration("http://feeds.feedburner.com/LeBlogDesExpertsJ2ee?format=xml"));

        String uri = sut.getRssEndpointUri();

        assertThat(uri, startsWith("rss:http://feeds.feedburner.com/LeBlogDesExpertsJ2ee?format=xml&lastUpdate="));
    }

    @Test
    public void getRssEndpointUri_handlesUrlWithoutParameter() {
        sut.setConfiguration(getRssBotConfiguration("http://whatever"));

        String uri = sut.getRssEndpointUri();

        assertThat(uri, startsWith("rss:http://whatever?lastUpdate="));
    }

    private TatamibotConfiguration getRssBotConfiguration(String url) {
        TatamibotConfiguration configuration = new TatamibotConfiguration();
        configuration.setTatamibotConfigurationId("TEST_CONFIG_ID");
        configuration.setType(TatamibotConfiguration.TatamibotType.RSS);     // spécifique ... mais pas utilisé ici
        configuration.setDomain("ippon.fr");
        configuration.setUrl(url);
        configuration.setPollingDelay(60); // not used here
        configuration.setLastUpdateDate(DateTime.parse("2010-01-01T00:00:00").toDate());
        return configuration;
    }

}
