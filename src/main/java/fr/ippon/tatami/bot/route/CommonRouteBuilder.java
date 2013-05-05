package fr.ippon.tatami.bot.route;

import javax.inject.Inject;

import org.apache.camel.Body;
import org.apache.camel.Exchange;
import org.apache.camel.Header;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.common.base.Strings;

import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import fr.ippon.tatami.bot.processor.LastUpdateDateTatamibotConfigurationUpdater;
import fr.ippon.tatami.bot.processor.TatamiStatusProcessor;

@Component // This one IS a component as it is a singleton 
public class CommonRouteBuilder extends RouteBuilder {

    private static final Log log = LogFactory.getLog(CommonRouteBuilder.class);
    
    @Inject
    private TatamiStatusProcessor tatamiStatusProcessor;
    
    @Inject
    private LastUpdateDateTatamibotConfigurationUpdater lastUpdateDateTatamibotConfigurationUpdater;

    @Override
    public void configure() {

        // Final endpoint used to send status to Tatami : 

        from("direct:toTatami"). // TODO : switch from direct: endpoint to an asynchronous one : seda: or jms: (for throttling in particular)
        bean(new TagAppender()).
        bean(tatamiStatusProcessor).
        bean(lastUpdateDateTatamibotConfigurationUpdater);
        
    }
    
    public static class TagAppender {
        public String process(@Body String body, @Header("tatamibotConfiguration") TatamibotConfiguration configuration) throws Exception {
            if (! Strings.isNullOrEmpty(configuration.getTag())) {
                body = body+ " #" + configuration.getTag();
            }
            return body;
        }
    }

}
