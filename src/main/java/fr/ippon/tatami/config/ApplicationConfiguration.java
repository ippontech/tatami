package fr.ippon.tatami.config;

import fr.ippon.tatami.config.elasticsearch.ElasticSearchConfiguration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.thrift.transport.TTransportException;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableAsync;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.IOException;

@Configuration
@PropertySource("classpath:/META-INF/tatami/tatami.properties")
@ComponentScan(basePackages = {"fr.ippon.tatami.application", "fr.ippon.tatami.repository", "fr.ippon.tatami.service", "fr.ippon.tatami.security"})
@Import(value = {CacheConfiguration.class, CassandraConfiguration.class, ElasticSearchConfiguration.class})
@ImportResource({"classpath:META-INF/spring/applicationContext-security.xml"})
@EnableAsync
public class ApplicationConfiguration {

    private final Log log = LogFactory.getLog(ApplicationConfiguration.class);

    @Inject
    private Environment env;

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        Constants.GOOGLE_ANALYTICS_KEY = env.getProperty("tatami.google.analytics.key");
        log.info("Tatami started!");
    }
}
