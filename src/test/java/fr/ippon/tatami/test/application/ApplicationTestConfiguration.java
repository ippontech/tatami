package fr.ippon.tatami.test.application;

import fr.ippon.tatami.config.AsyncConfiguration;
import fr.ippon.tatami.config.CassandraConfiguration;
import fr.ippon.tatami.config.MailConfiguration;
import fr.ippon.tatami.config.SearchConfiguration;
import org.apache.thrift.transport.TTransportException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.*;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Configuration
@PropertySource("classpath:/tatami/tatami-test.properties")
@ComponentScan(basePackages = {"fr.ippon.tatami.repository", "fr.ippon.tatami.service", "fr.ippon.tatami.security"})
@Import(value = {AsyncConfiguration.class,
        CassandraConfiguration.class,
        SearchConfiguration.class,
        MailConfiguration.class})
@ImportResource({"classpath:META-INF/spring/applicationContext-security.xml"})
public class ApplicationTestConfiguration {

    private final Logger log = LoggerFactory.getLogger(ApplicationTestConfiguration.class);

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        this.log.info("Tatami test context started!");
    }
}
