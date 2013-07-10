package fr.ippon.tatami.bot.route;

import com.google.common.collect.Lists;
import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.processor.idempotent.MemoryIdempotentRepository;
import org.apache.camel.spi.IdempotentRepository;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Test;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;

import static com.jayway.awaitility.Awaitility.await;
import static com.jayway.awaitility.Awaitility.to;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;

public abstract class SourceRouteBuilderBaseCamelTest<T extends SourceRouteBuilderBase> extends CamelTestSupport {

    protected final Logger log = LoggerFactory.getLogger(this.getClass());

    protected List<String> messages = Lists.newArrayList();
    private List<Message> camelMessages = Lists.newArrayList();

    private TatamibotConfiguration botConfiguration;

    @Spy
    private IdempotentRepository<String> idempotentRepository = new MemoryIdempotentRepository();

    private SourceRouteBuilderBase sut;

    protected boolean disableDateHeaderTest = false;

    private Class<T> builderType;

    public SourceRouteBuilderBaseCamelTest(Class<T> builderType) {
        super();
        this.builderType = builderType;
    }

    @Override
    protected RouteBuilder[] createRouteBuilders() throws Exception {

        MockitoAnnotations.initMocks(this);

        RouteBuilder commonRoutebuilder = new RouteBuilder() {
            @Override
            public void configure() throws Exception {
                from("direct:toTatami").process(new Processor() {
                    @Override
                    public void process(Exchange exchange) throws Exception {
                        Message in = exchange.getIn();
                        camelMessages.add(in);
                        messages.add((String) in.getBody(String.class));
                    }
                });
            }
        };

        botConfiguration = getBotConfiguration();

//        sut = new RssRouteBuilder(); // spécifique ...
        sut = builderType.newInstance();
        sut.setIdempotentRepository(idempotentRepository);
        sut.setTatamiBotLogin("bot@ippon.fr");
        sut.setConfiguration(botConfiguration);

        return new RouteBuilder[]{commonRoutebuilder, sut};
    }

    @Override
    public boolean isUseAdviceWith() {
        return true;
    }

    @Test
    public void shouldConformToSourceRouteBuilderBaseRequirements() throws Exception {
        launchContext();

        await().untilCall(to(messages).size(), is(greaterThanOrEqualTo(1)));

        // behaviour of a SourceRouteBuilderBase
        // Some headers must be provided :
        Message firstCamelMsg = camelMessages.get(0);
        assertThat(firstCamelMsg.getHeader("login", String.class), is("bot@ippon.fr"));
        assertThat(firstCamelMsg.getHeader("tatamibotConfiguration", TatamibotConfiguration.class), is(botConfiguration));

        // Question : is it specific to rss ?
        if (!disableDateHeaderTest) {
            assertThat(firstCamelMsg.getHeader("tatamibotLastUpdateDate", Date.class), is(notNullValue()));
        }

        // idempotentRepository must be called :
        String msg = getFirstMsgBody();
        Mockito.verify(idempotentRepository).add("ippon.fr-" + msg);

    }

    protected abstract TatamibotConfiguration getBotConfiguration();

    protected abstract void launchContext() throws Exception;

    protected abstract String getFirstMsgBody();
}
