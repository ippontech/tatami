package fr.ippon.tatami.config;

import com.yammer.metrics.HealthChecks;
import com.yammer.metrics.reporting.GraphiteReporter;
import com.yammer.metrics.reporting.RiemannReporter;
import com.yammer.metrics.reporting.RiemannReporter.ConfigBuilder;

import fr.ippon.tatami.config.metrics.CassandraHealthCheck;
import fr.ippon.tatami.config.metrics.JavaMailHealthCheck;
import fr.ippon.tatami.service.MailService;
import me.prettyprint.hector.api.Keyspace;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
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

            initGraphite();
            initRiemann();
        }
    }

	private void initGraphite() {
		String graphiteHost = env.getProperty("tatami.metrics.graphite.host");
		if (!StringUtils.isEmpty(graphiteHost)) {
		    log.debug("Initializing Metrics Graphite reporting");
		    Integer graphitePort = env.getProperty("tatami.metrics.graphite.port", Integer.class);
		    GraphiteReporter.enable(1,
		            TimeUnit.MINUTES,
		            graphiteHost,
		            graphitePort);
		} else {
		    log.debug("Graphite server is not configured : disabling graphite reporting");
		}
	}

	private void initRiemann() {
		String riemannHost = env.getProperty("tatami.metrics.riemann.host");
		if (!StringUtils.isEmpty(riemannHost)) {
			log.debug("Initializing Metrics Riemann reporting");
			
			ConfigBuilder builder = RiemannReporter.Config.newBuilder();
			builder.host(riemannHost);

			Integer riemannPort = env.getProperty("tatami.metrics.riemann.port", Integer.class);
			if (riemannPort != null)
				builder.port(riemannPort);
			
			List<String> tagsList = new ArrayList<String>();
			tagsList.add("tatami");
			
			String tags = env.getProperty("tatami.metrics.riemann.tags");
			if (!StringUtils.isEmpty(tags)) {
				tagsList.addAll( Arrays.asList(tags.split(",")));
			}
			builder.tags(tagsList);

		    RiemannReporter.enable(builder.build());
		} else {
			log.debug("Riemann server is not configured : disabling riemann reporting");
		}
	}
}
