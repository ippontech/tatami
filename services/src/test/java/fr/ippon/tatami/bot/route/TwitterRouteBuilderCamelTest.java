package fr.ippon.tatami.bot.route;


import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import org.apache.camel.builder.AdviceWithRouteBuilder;
import org.joda.time.DateTime;
import org.junit.Test;
import twitter4j.Status;
import twitter4j.User;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import static com.jayway.awaitility.Awaitility.await;
import static com.jayway.awaitility.Awaitility.to;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * This test only tests the route, the twitter input-connector is mocked
 */
public class TwitterRouteBuilderCamelTest extends SourceRouteBuilderBaseCamelTest<TwitterRouteBuilder> {

    public TwitterRouteBuilderCamelTest() {
        super(TwitterRouteBuilder.class);

//        TimeZone.setDefault(TimeZone.getTimeZone("PST"));

        disableDateHeaderTest = true;
    }

    @Test
    public void testTwitterRoute() throws Exception {

        launchContext();

        await().untilCall(to(messages).size(), is(greaterThanOrEqualTo(1)));

        assertThat(messages, hasSize(1));
        assertThat(messages.get(0), is(getFirstMsgBody()));
    }

    // ---

    @Override
    protected String getFirstMsgBody() {
        // computing timezone in under to allow the test to run in remote CI server (which is in another timezone)
        String timezone = TimeZone.getDefault().getDisplayName(false, TimeZone.SHORT, Locale.US); // From Date.toString() ...
        return "Sat Jan 05 12:34:00 " + timezone + " 2013 (ippontech) a first tweet";
    }

    @Override
    protected void launchContext() throws Exception {

        // we replace the input (twitter connector) of the route with a "direct" endpoint :

        String routeDefId = "twitter-ippon.fr";
        context.getRouteDefinition(routeDefId).adviceWith(context, new AdviceWithRouteBuilder() {
            @Override
            public void configure() throws Exception {
                replaceFromWith("direct:twitterRouteTest");
            }
        });

        context.start(); // necessary because of isUseAdviceWith=true

        simulateInputMessage();
    }

    private void simulateInputMessage() throws ParseException {
        Status fakeStatus = fakeTwitterStatus("2013/01/05 12:34", "ippontech", "a first tweet");
        template.sendBody("direct:twitterRouteTest", fakeStatus);
    }

    private Status fakeTwitterStatus(String createdAtAsStr, String screenName, String text) throws ParseException {
        // cf {@link TwitterConverter.toString} : we only need date, user and text at the moment
        User user = mock(User.class);
        when(user.getScreenName()).thenReturn(screenName);
        Status status = mock(Status.class);
        Date createdAt = new SimpleDateFormat("yyyy/MM/dd HH:mm").parse(createdAtAsStr);
        when(status.getUser()).thenReturn(user);
        when(status.getCreatedAt()).thenReturn(createdAt);
        when(status.getText()).thenReturn(text);

        return status;
    }

    @Override
    protected TatamibotConfiguration getBotConfiguration() {

        TatamibotConfiguration configuration = new TatamibotConfiguration();
        configuration.setTatamibotConfigurationId("TEST_CONFIG_ID");
        configuration.setType(TatamibotConfiguration.TatamibotType.TWITTER);
        configuration.setDomain("ippon.fr");
//        configuration.setUrl("??");
        configuration.setPollingDelay(60); // not used here
        configuration.setLastUpdateDate(DateTime.parse("2010-01-01T00:00:00").toDate());
        return configuration;
    }


}
