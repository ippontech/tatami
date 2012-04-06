package fr.ippon.tatami.application;

import fr.ippon.tatami.config.CassandraConfiguration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.thrift.transport.TTransportException;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Configuration
@PropertySource("classpath:/tatami/tatami-test.properties")
@ComponentScan(basePackages = {"fr.ippon.tatami.application", "fr.ippon.tatami.repository", "fr.ippon.tatami.service", "fr.ippon.tatami.security", "fr.ippon.tatami.repository"})
@Import(value = {CassandraConfiguration.class})
public class ApplicationTestConfiguration {

    private final Log log = LogFactory.getLog(ApplicationTestConfiguration.class);

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        log.info("Tatami test context started!");
    }
}
