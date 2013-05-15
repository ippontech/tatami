package fr.ippon.tatami.test.application;

import fr.ippon.tatami.config.DispatcherServletConfig;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.thrift.transport.TTransportException;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.web.WebAppConfiguration;

import javax.annotation.PostConstruct;
import java.io.IOException;

@WebAppConfiguration
@Configuration
@Import(value = {DispatcherServletConfig.class})
public class WebApplicationTestConfiguration {

    private final Log log = LogFactory.getLog(WebApplicationTestConfiguration.class);

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        this.log.info("Tatami Web test context started!");
    }
}
