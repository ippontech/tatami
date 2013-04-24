package fr.ippon.tatami.test.application;

import fr.ippon.tatami.config.AsyncConfiguration;
import fr.ippon.tatami.config.CassandraConfiguration;
import fr.ippon.tatami.config.MailConfiguration;
import fr.ippon.tatami.config.SearchConfiguration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.thrift.transport.TTransportException;
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

    private final Log log = LogFactory.getLog(ApplicationTestConfiguration.class);

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        this.log.info("Tatami test context started!");
    }
}
