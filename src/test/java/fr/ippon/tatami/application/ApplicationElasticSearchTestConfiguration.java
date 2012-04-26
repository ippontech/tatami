package fr.ippon.tatami.application;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.thrift.transport.TTransportException;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;

import fr.ippon.tatami.config.elasticsearch.ElasticSearchConfiguration;

@Configuration
@PropertySource({"classpath:/tatami/tatami-test.properties", "classpath:/tatami/tatami-es-test.properties"})
@Import(value = {ElasticSearchTestConfiguration.class, ElasticSearchConfiguration.class})
public class ApplicationElasticSearchTestConfiguration {

    private final Log log = LogFactory.getLog(ApplicationElasticSearchTestConfiguration.class);

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        log.info("Tatami test context started!");
    }
    
}
