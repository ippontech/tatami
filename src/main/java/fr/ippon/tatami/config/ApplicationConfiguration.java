package fr.ippon.tatami.config;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.thrift.transport.TTransportException;
import org.springframework.context.annotation.*;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Configuration
@PropertySource("classpath:/META-INF/tatami/tatami.properties")
@ComponentScan(basePackages = {"fr.ippon.tatami.application", "fr.ippon.tatami.repository", "fr.ippon.tatami.service"})
@Import(value = {CacheConfiguration.class, CassandraConfiguration.class})
@ImportResource({"classpath:META-INF/spring/applicationContext-security.xml"})
public class ApplicationConfiguration {

    private final Log log = LogFactory.getLog(ApplicationConfiguration.class);


    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        log.info("Tatami started!");
    }

}
