package fr.ippon.tatami.config;

import com.yammer.metrics.HealthChecks;
import com.yammer.metrics.reporting.GraphiteReporter;
import fr.ippon.tatami.config.metrics.CassandraHealthCheck;
import fr.ippon.tatami.config.metrics.JavaMailHealthCheck;
import fr.ippon.tatami.service.MailService;
import me.prettyprint.hector.api.Keyspace;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.concurrent.TimeUnit;

@Configuration
public class MetricsConfiguration {

    private final Logger log = LoggerFactory.getLogger(MetricsConfiguration.class);

    @Inject
    private Environment env;

    @Inject
    private Keyspace keyspaceOperator;

    @Inject
    private MailService mailService;

    @PostConstruct
    public void initMetrics() {
        if (env.acceptsProfiles(Constants.SPRING_PROFILE_METRICS)) {
            log.debug("Initializing Metrics healthchecks");
            HealthChecks.register(new CassandraHealthCheck(keyspaceOperator));
            HealthChecks.register(new JavaMailHealthCheck(mailService));

            String graphiteHost = env.getProperty("tatami.metrics.graphite.host");
            if (graphiteHost != null) {
                log.debug("Initializing Metrics Graphite reporting");
                Integer graphitePort = env.getProperty("tatami.metrics.graphite.port", Integer.class);
                GraphiteReporter.enable(1,
                        TimeUnit.MINUTES,
                        graphiteHost,
                        graphitePort);
            } else {
                log.warn("Graphite server is not configured, unable to send any data to Graphite");
            }
        }
    }
}
