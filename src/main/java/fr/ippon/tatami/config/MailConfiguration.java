package fr.ippon.tatami.config;

import fr.ippon.tatami.service.MailService;
import org.apache.commons.lang.CharEncoding;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.env.Environment;
import org.springframework.ui.velocity.VelocityEngineFactoryBean;

import javax.inject.Inject;
import java.io.IOException;
import java.util.Properties;

/**
 * Configuration for velocity template and i18n for emails.
 *
 * @author Pierre Rust
 */
@Configuration
@PropertySource({"classpath:/META-INF/tatami/tatami.properties"})
public class MailConfiguration {

    private final Log log = LogFactory.getLog(MailConfiguration.class);

    @Inject
    private Environment env;


    @Bean
    public VelocityEngine velocityEngine() throws IOException {
        VelocityEngineFactoryBean factory = new VelocityEngineFactoryBean();
        Properties props = new Properties();

        props.put("resource.loader", "class");
        props.put("class.resource.loader.class","org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader" );
        // TODO : FileResourceLoader could be used to externalize templates

        // enable relative includes
        props.put("eventhandler.include.class", "org.apache.velocity.app.event.implement.IncludeRelativePath");

        factory.setVelocityProperties(props);
        return factory.createVelocityEngine();
    }


    @Bean
    public MessageSource mailMessageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:/META-INF/tatami/mails/messages/messages");
        messageSource.setDefaultEncoding(CharEncoding.UTF_8);
        if ("true".equals(env.getProperty("tatami.message.reloading.enabled"))) {
            log.info("loading reloadable mail messages resources");
            messageSource.setCacheSeconds(1);
        } else
        {
            log.info("loading non-reloadable mail messages resources");
        }
        return messageSource;
    }

}
