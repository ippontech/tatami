package fr.ippon.tatami.config;

import com.yammer.metrics.HealthChecks;
import fr.ippon.tatami.config.metrics.CassandraHealthCheck;
import fr.ippon.tatami.config.metrics.JavaMailHealthCheck;
import fr.ippon.tatami.service.MailService;
import me.prettyprint.hector.api.Keyspace;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

@Configuration
public class HealthCheckConfiguration {

    @Inject
    private Keyspace keyspaceOperator;

    @Inject
    private MailService mailService;

    @PostConstruct
    public void initHealthChecks() {
        HealthChecks.register(new CassandraHealthCheck(keyspaceOperator));
        HealthChecks.register(new JavaMailHealthCheck(mailService));
    }
}
