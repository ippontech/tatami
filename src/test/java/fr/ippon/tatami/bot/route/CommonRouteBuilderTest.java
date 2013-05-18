package fr.ippon.tatami.bot.route;

import static com.jayway.awaitility.Awaitility.await;
import static org.mockito.Mockito.verify;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import fr.ippon.tatami.bot.processor.LastUpdateDateTatamibotConfigurationUpdater;
import fr.ippon.tatami.bot.processor.TatamiStatusProcessor;
import fr.ippon.tatami.test.MockUtils;

public class CommonRouteBuilderTest extends CamelTestSupport {

    private static final Log log = LogFactory.getLog(CommonRouteBuilderTest.class);
    
    private static Date value = new Date();
    
    @Mock
    private TatamiStatusProcessor tatamiStatusProcessor;
    
    @Mock
    private LastUpdateDateTatamibotConfigurationUpdater lastUpdateDateTatamibotConfigurationUpdater;

    @InjectMocks
    private CommonRouteBuilder sut;

    @Override
    // Called during @Before handling of the super class ...
    protected RouteBuilder createRouteBuilder() throws Exception {
        MockitoAnnotations.initMocks(this);
        
        return sut;
    }

    @Test
    public void commonRouteSendStatusAndUpdateConfiguration() throws Exception {
        TatamibotConfiguration configuration = new TatamibotConfiguration();
        configuration.setTag("MyTag");
        
        sendAMessage(configuration);
       
        await().until(lastProcessorWasCalled());
        
        verify(tatamiStatusProcessor).sendStatus("The content #MyTag", "bot@ippon.fr");
        verify(lastUpdateDateTatamibotConfigurationUpdater).updateLastDate(value, configuration);
        
    }

    @Test
    public void commonRouteShouldAddTagIfPresent() throws Exception {
        TatamibotConfiguration configuration = new TatamibotConfiguration();
        configuration.setTag("MyTag");
        
        sendAMessage(configuration);
        
        await().until(lastProcessorWasCalled());
        
        verify(tatamiStatusProcessor).sendStatus("The content #MyTag", "bot@ippon.fr");
    }


    @Test
    public void commonRouteDoesNotModifyMessageIfTagIsAbsent() throws Exception {
        TatamibotConfiguration configuration = new TatamibotConfiguration();
        
        sendAMessage(configuration);
        
        await().until(lastProcessorWasCalled());
        
        verify(tatamiStatusProcessor).sendStatus("The content", "bot@ippon.fr");
    }

    private void sendAMessage(TatamibotConfiguration configuration) {
        Map<String, Object> headers = new HashMap<String, Object>();
        headers.put("tatamibotConfiguration", configuration);
        headers.put("login", "bot@ippon.fr");
        headers.put("tatamibotLastUpdateDate", value);
        template.sendBodyAndHeaders("direct:toTatami", "The content", headers);
    }

    private Callable<Boolean> lastProcessorWasCalled() {
//        return MockUtils.mockCalledCallable(tatamiStatusProcessor, 1);
        return MockUtils.mockCalledCallable(lastUpdateDateTatamibotConfigurationUpdater, 1);
    }

}
