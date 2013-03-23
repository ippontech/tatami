package fr.ippon.tatami.config;

import com.yammer.metrics.HealthChecks;
import fr.ippon.tatami.config.metrics.CassandraHealthCheck;
import fr.ippon.tatami.config.metrics.JavaMailHealthCheck;
import fr.ippon.tatami.service.MailService;
import me.prettyprint.hector.api.Keyspace;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

@Configuration
public class HealthCheckConfiguration {

    private final Log log = LogFactory.getLog(HealthCheckConfiguration.class);

    @Inject
    private Environment env;

    @Inject
    private Keyspace keyspaceOperator;

    @Inject
    private MailService mailService;

    @PostConstruct
    public void initHealthChecks() {
        if ("true".equals(env.getProperty("tatami.metrics.enabled"))) {
            log.debug("Initializing Metrics healthchecks");
            HealthChecks.register(new CassandraHealthCheck(keyspaceOperator));
            HealthChecks.register(new JavaMailHealthCheck(mailService));
        }
    }
}
