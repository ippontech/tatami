package fr.ippon.tatami.bot;

import static com.google.common.collect.Sets.newHashSet;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.Mockito.*;

import java.util.List;

import org.apache.camel.Route;
import org.apache.camel.processor.idempotent.MemoryIdempotentRepository;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hamcrest.CoreMatchers;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.ContextHierarchy;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;
import org.springframework.test.util.ReflectionTestUtils;

import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import fr.ippon.tatami.bot.processor.TatamiStatusProcessor;
import fr.ippon.tatami.bot.test.FakeTatamiStatusProcessor;
import fr.ippon.tatami.domain.Domain;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.repository.TatamibotConfigurationRepository;
import fr.ippon.tatami.service.StatusUpdateService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.test.application.ApplicationTestConfiguration;
import fr.ippon.tatami.test.application.WebApplicationTestConfiguration;

public class TatamibotWithTatamiProcessorTest extends CamelTestSupport {

    private static final Log log = LogFactory.getLog(TatamibotWithTatamiProcessorTest.class);
       
    @Mock
    private DomainRepository domainRepository;

    @Mock
    private TatamibotConfigurationRepository tatamibotConfigurationRepository;

    @Mock
    private UserService userService;
    
    @Mock
    private StatusUpdateService statusUpdateService;
    
    @InjectMocks
    private Tatamibot bot;

    @InjectMocks
    private TatamiStatusProcessor processor; // real one here ...

    User tatamibotUser = new User();
    
    @Before
    public void setup() throws Exception {
        processor = new TatamiStatusProcessor();
        bot = new Tatamibot();
        MockitoAnnotations.initMocks(this); // init bot and processor with mock dependency
        ReflectionTestUtils.setField(bot, "idempotentRepository", new MemoryIdempotentRepository());
        ReflectionTestUtils.setField(bot, "tatamiStatusProcessor", processor);
        
        // common mock configuration :
        when(userService.getUserByLogin("tatamibot@ippon.fr")).thenReturn(tatamibotUser);
        when(tatamibotConfigurationRepository.findTatamibotConfigurationById(Mockito.anyString())).thenReturn(new TatamibotConfiguration());
    }


    @Test
    public void testRssRouteOnly() throws Exception {
        
        TatamibotConfiguration configuration = getRssBotConfiguration();
        configuration.setTag("BlogIppon");  // <<<  ==== TAG 

        setupAndLaunchContext(configuration);

        Thread.sleep(2000); // default initial delay is 1000ms on rss component // TODO : configure a smaller one for the test...
        
        String msg1 = "[Ippevent Mobilité – Applications mobiles – ouverture des inscriptions](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/GcJYERHTfoQ/) #BlogIppon";
        String msg2 = "[Business – Ippon Technologies acquiert Atomes et renforce son offre Cloud](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/wK-Y47WGZBQ/) #BlogIppon";
        String msg3 = "[Les Méthodes Agiles – Définition de l’Agilité](http://feedproxy.google.com/~r/LeBlogDesExpertsJ2ee/~3/hSqyt1MCOoo/) #BlogIppon";
        
        verify(statusUpdateService).postStatusAsUser(msg1, tatamibotUser);
        verify(statusUpdateService).postStatusAsUser(msg2, tatamibotUser);
        verify(statusUpdateService).postStatusAsUser(msg3, tatamibotUser);
        verifyNoMoreInteractions(statusUpdateService);
        
        // TODO : le repository est mis à jour 3 fois ...
        ArgumentCaptor<TatamibotConfiguration> argumentCaptor = ArgumentCaptor.forClass(TatamibotConfiguration.class);
        verify(tatamibotConfigurationRepository,times(3)).updateTatamibotConfiguration(argumentCaptor.capture());
        TatamibotConfiguration value = argumentCaptor.getValue();
        assertThat(value.getLastUpdateDate(),is(DateTime.parse("2012-12-17T17:35:51Z").toDate()));
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
