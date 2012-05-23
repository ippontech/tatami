package fr.ippon.tatami.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.inject.Inject;

/**
 * @author dmartin
 */
@Configuration
public class MiscBeanConfiguration {

    @Inject
    private Environment env;

    @Bean
    public String shortURLPrefix() {
        return this.env.getProperty("tatami.short.url.prefix");
    }

}
