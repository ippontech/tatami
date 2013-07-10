package fr.ippon.tatami.test.application;

import fr.ippon.tatami.config.DispatcherServletConfig;
import org.apache.thrift.transport.TTransportException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.web.WebAppConfiguration;

import javax.annotation.PostConstruct;
import java.io.IOException;

@WebAppConfiguration
@Configuration
@Import(value = {DispatcherServletConfig.class})
public class WebApplicationTestConfiguration {

    private final Logger log = LoggerFactory.getLogger(WebApplicationTestConfiguration.class);

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        this.log.info("Tatami Web test context started!");
    }
}
