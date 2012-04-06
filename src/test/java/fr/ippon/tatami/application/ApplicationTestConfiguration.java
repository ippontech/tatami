package fr.ippon.tatami.application;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.thrift.transport.TTransportException;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;

import fr.ippon.tatami.config.CassandraConfiguration;

@Configuration
@PropertySource("classpath:/tatami/tatami-test.properties")
@ComponentScan(basePackages = {"fr.ippon.tatami.application", "fr.ippon.tatami.repository", "fr.ippon.tatami.service", "fr.ippon.tatami.security"})
@Import(value = {CassandraConfiguration.class})
public class ApplicationTestConfiguration {

    private final Log log = LogFactory.getLog(ApplicationTestConfiguration.class);

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        log.info("Tatami test context started!");
    }
}
