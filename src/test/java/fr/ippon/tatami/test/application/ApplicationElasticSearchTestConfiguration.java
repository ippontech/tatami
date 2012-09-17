package fr.ippon.tatami.test.application;

import fr.ippon.tatami.config.SearchConfiguration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.thrift.transport.TTransportException;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Configuration
@PropertySource({"classpath:/tatami/tatami-test.properties", "classpath:/tatami/tatami-es-test.properties"})
@Import(value = {ElasticSearchTestConfiguration.class, SearchConfiguration.class})
public class ApplicationElasticSearchTestConfiguration {

    private final Log log = LogFactory.getLog(ApplicationElasticSearchTestConfiguration.class);

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        log.info("Tatami test context started!");
    }

}
