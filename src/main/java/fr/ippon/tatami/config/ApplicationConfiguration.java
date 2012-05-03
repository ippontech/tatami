package fr.ippon.tatami.config;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.thrift.transport.TTransportException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

import fr.ippon.tatami.config.elasticsearch.ElasticSearchConfiguration;

@Configuration
@PropertySource("classpath:/META-INF/tatami/tatami.properties")
@ComponentScan(basePackages = {"fr.ippon.tatami.application", "fr.ippon.tatami.repository", "fr.ippon.tatami.service", "fr.ippon.tatami.security"})
@Import(value = {CacheConfiguration.class, CassandraConfiguration.class, ElasticSearchConfiguration.class})
@ImportResource({"classpath:META-INF/spring/applicationContext-security.xml"})
public class ApplicationConfiguration {

    private final Log log = LogFactory.getLog(ApplicationConfiguration.class);

    @Inject
    private Environment env;

    @Bean
    public String shortURLPrefix() {
        return this.env.getProperty("tatami.short.url.prefix");
    }

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        this.log.info("Tatami started!");
    }

}
