package fr.ippon.tatami.bot;

import static com.google.common.collect.Sets.newHashSet;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.Mockito.when;

import java.util.List;

import org.apache.camel.Route;
import org.apache.camel.processor.idempotent.MemoryIdempotentRepository;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import fr.ippon.tatami.bot.test.FakeTatamiStatusProcessor;
import fr.ippon.tatami.domain.Domain;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.repository.TatamibotConfigurationRepository;
import fr.ippon.tatami.service.UserService;

public class TatamibotUnitTest extends CamelTestSupport {

    private static final Log log = LogFactory.getLog(TatamibotUnitTest.class);
    
    private FakeTatamiStatusProcessor processor;
    
    @Mock
    private DomainRepository domainRepository;

    @Mock
    private TatamibotConfigurationRepository tatamibotConfigurationRepository;

    @Mock
    private UserService userService;
    
    @InjectMocks
    private Tatamibot bot;

    @Before
    public void setup() throws Exception {

        processor = new FakeTatamiStatusProcessor();
        
        bot = new Tatamibot();
        MockitoAnnotations.initMocks(this); // init bot with mock dependency
        ReflectionTestUtils.setField(bot, "idempotentRepository", new MemoryIdempotentRepository());
        ReflectionTestUtils.setField(bot, "tatamiStatusProcessor", processor);
    }


    @Test
    public void testRssRouteOnlyWithoutTag() throws Exception {
        
        TatamibotConfiguration configuration = getRssBotConfiguration();
        setupAndLaunchContext(configuration);
        
        Thread.sleep(2000); // default initial delay is 1000ms on rss component // TODO : configure a smaller one for the test...
        
        List<String> messages = processor.messages;

        assertThat(messages, hasSize(3));
        // TODO : assert order ...
        assertThat(messages,hasItems(
                "[Ippevent Mobilité – Applications mobiles – ouverture des inscriptions](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/GcJYERHTfoQ/)",
                "[Business – Ippon Technologies acquiert Atomes et renforce son offre Cloud](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/wK-Y47WGZBQ/)",
                "[Les Méthodes Agiles – Définition de l’Agilité](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/hSqyt1MCOoo/)"));
    }
    
    @Test
    public void testRssRouteOnly() throws Exception {
        
        TatamibotConfiguration configuration = getRssBotConfiguration();
        configuration.setTag("BlogIppon");  // <<<  ==== TAG 

        setupAndLaunchContext(configuration);

        Thread.sleep(2000); // default initial delay is 1000ms on rss component // TODO : configure a smaller one for the test...
        
        List<String> messages = processor.messages;
        
        assertThat(messages, hasSize(3));
        // TODO : assert order ...
        assertThat(messages,hasItems(
                "[Ippevent Mobilité – Applications mobiles – ouverture des inscriptions](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/GcJYERHTfoQ/) #BlogIppon",
                "[Business – Ippon Technologies acquiert Atomes et renforce son offre Cloud](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/wK-Y47WGZBQ/) #BlogIppon",
                "[Les Méthodes Agiles – Définition de l’Agilité](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/hSqyt1MCOoo/) #BlogIppon"));
    }


    private void setupAndLaunchContext(TatamibotConfiguration configuration) throws Exception {
        Domain domain = new Domain();
        domain.setName("ippon.fr");

        when(domainRepository.getAllDomains()).thenReturn(newHashSet(domain));
        when(tatamibotConfigurationRepository.findTatamibotConfigurationsByDomain("ippon.fr")).thenReturn(newHashSet(configuration));

        // Note : we have to configure the context ourself as the mocks are used during route creation ..  
        context.addRoutes(bot);
        
        context.start();
        
        List<Route> routes = context.getRoutes();
        assertThat(routes, hasSize(1));
//        assertThat(routes.get(0).get, hasItems());
    }
    

    private TatamibotConfiguration getRssBotConfiguration() {
        final String fileUrl = this.getClass().getResource("route/rss.xml").toExternalForm();
        TatamibotConfiguration configuration = new TatamibotConfiguration();
        configuration.setTatamibotConfigurationId("TEST_CONFIG_ID");
        configuration.setType(TatamibotConfiguration.TatamibotType.RSS);
        configuration.setDomain("ippon.fr");
//        configuration.setUrl("http://feeds.feedburner.com/LeBlogDesExpertsJ2ee?format=xml");
        configuration.setUrl(fileUrl);
        configuration.setPollingDelay(60);
        configuration.setLastUpdateDate(DateTime.parse("2010-01-01T00:00:00").toDate());
        return configuration;
    }
}
