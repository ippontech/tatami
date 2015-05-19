package fr.ippon.tatami.config;

import org.apache.thrift.transport.TTransportException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.IOException;

@Configuration
@PropertySource({"classpath:/META-INF/tatami/tatami.properties",
        "classpath:/META-INF/tatami/customization.properties"})
@ComponentScan(basePackages = {
        "fr.ippon.tatami.repository",
        "fr.ippon.tatami.service",
        "fr.ippon.tatami.security"})
@Import(value = {
        AsyncConfiguration.class,
        CacheConfiguration.class,
        CassandraConfiguration.class,
        SearchConfiguration.class,
        MailConfiguration.class,
        MetricsConfiguration.class})
@ImportResource("classpath:META-INF/spring/applicationContext-*.xml")
public class ApplicationConfiguration {

    private final Logger log = LoggerFactory.getLogger(ApplicationConfiguration.class);

    @Inject
    private Environment env;

    /**
     * Initializes Tatami.
     * <p/>
     * Spring profiles can be configured with a system property -Dspring.profiles.active=your-active-profile
     * <p/>
     * Available profiles are :
     * - "apple-push" : for enabling Apple Push notifications
     * - "metrics" : for enabling Yammer Metrics
     * - "tatamibot" : for enabling the Tatami bot
     */
    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        log.debug("Looking for Spring profiles... Available profiles are \"metrics\", \"tatamibot\" and \"apple-push\"");
        if (env.getActiveProfiles().length == 0) {
            log.debug("No Spring profile configured, running with default configuration");
        } else {
            for (String profile : env.getActiveProfiles()) {
                log.debug("Detected Spring profile : " + profile);
            }
        }
        Constants.VERSION = env.getRequiredProperty("tatami.version");
        Constants.GOOGLE_ANALYTICS_KEY = env.getProperty("tatami.google.analytics.key");

        log.info("Tatami v. {} started!", Constants.VERSION);
        log.debug("Google Analytics key : {}", Constants.GOOGLE_ANALYTICS_KEY);

    }
}
