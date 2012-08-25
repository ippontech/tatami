package fr.ippon.tatami.config;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.thrift.transport.TTransportException;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.IOException;
import java.util.concurrent.Executor;

@Configuration
@PropertySource("classpath:/META-INF/tatami/tatami.properties")
@ComponentScan(basePackages = {"fr.ippon.tatami.application", "fr.ippon.tatami.repository", "fr.ippon.tatami.service"})
@Import(value = {CacheConfiguration.class, CassandraConfiguration.class, SearchConfiguration.class})
@ImportResource({"classpath:META-INF/spring/applicationContext-security.xml"})
@EnableAsync
public class ApplicationConfiguration implements AsyncConfigurer {

    private final Log log = LogFactory.getLog(ApplicationConfiguration.class);

    @Inject
    private Environment env;

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        Constants.VERSION = env.getRequiredProperty("tatami.version");
        Constants.GOOGLE_ANALYTICS_KEY = env.getProperty("tatami.google.analytics.key");
        if ("true".equals(env.getProperty("tatami.wro4j.enabled"))) {
            Constants.WRO4J_ENABLED = true;
        }
        log.info("Tatami v. " + Constants.VERSION + " started!");
        if (log.isDebugEnabled()) {
            log.debug("Google Analytics key : " + Constants.GOOGLE_ANALYTICS_KEY);
            log.debug("WRO4J enabled : " + Constants.WRO4J_ENABLED);
        }
    }

    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(10000);
        executor.setThreadNamePrefix("TatamiExecutor-");
        executor.initialize();
        return executor;
    }
}
