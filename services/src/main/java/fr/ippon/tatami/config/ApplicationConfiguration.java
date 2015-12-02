package fr.ippon.tatami.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StopWatch;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.IOException;
import java.util.Date;

import static springfox.documentation.builders.PathSelectors.regex;

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
        CassandraDataAutoConfiguration.class,
        SearchConfiguration.class,
        MailConfiguration.class,
        MetricsConfiguration.class})
@ImportResource("classpath:META-INF/spring/applicationContext-*.xml")
public class ApplicationConfiguration {

    private final Logger log = LoggerFactory.getLogger(ApplicationConfiguration.class);

    @Inject
    private Environment env;

    public static final String DEFAULT_INCLUDE_PATTERN = "/tatami/.*";

    @Bean
    public Docket swaggerSpringfoxDocket() {
        log.debug("Starting Swagger");
        StopWatch watch = new StopWatch();
        watch.start();
        ApiInfo apiInfo = new ApiInfo(
                env.getProperty("swagger.title"),
                env.getProperty("swagger.description"),
                env.getProperty("swagger.version"),
                env.getProperty("swagger.termsOfServiceUrl"),
                env.getProperty("swagger.contact"),
                env.getProperty("swagger.license"),
                env.getProperty("swagger.licenseUrl"));

        Docket docket = new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo)
                .genericModelSubstitutes(ResponseEntity.class)
                .forCodeGeneration(true)
                .genericModelSubstitutes(ResponseEntity.class)
                .directModelSubstitute(java.time.LocalDate.class, String.class)
                .directModelSubstitute(java.time.ZonedDateTime.class, Date.class)
                .directModelSubstitute(java.time.LocalDateTime.class, Date.class)
                .select()
                .paths(regex(DEFAULT_INCLUDE_PATTERN))
                .build();
        watch.stop();
        log.debug("Started Swagger in {} ms", watch.getTotalTimeMillis());
        return docket;
    }


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
    public void initTatami() throws IOException {
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
