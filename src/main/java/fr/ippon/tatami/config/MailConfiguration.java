package fr.ippon.tatami.config;

import org.apache.commons.lang.CharEncoding;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.ui.velocity.VelocityEngineFactoryBean;

import java.io.IOException;
import java.util.Properties;

/**
 * Configuration for velocity template and i18n for emails.
 *
 * @author Pierre Rust
 */
@Configuration
public class MailConfiguration {

    private final Log log = LogFactory.getLog(MailConfiguration.class);

    @Bean
    public VelocityEngine velocityEngine() throws IOException {
        VelocityEngineFactoryBean factory = new VelocityEngineFactoryBean();
        Properties props = new Properties();

        props.put("resource.loader", "class");
        props.put("class.resource.loader.class", "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");

        // necessary to get logs on templates's error
        props.put("runtime.log.logsystem.class", "org.apache.velocity.runtime.log.Log4JLogChute");
        props.put("runtime.log.error.stacktrace", "true");
        props.put("runtime.log.warn.stacktrace", "true");
        props.put("runtime.log.info.stacktrace", "true");
        props.put("runtime.log.invalid.reference", "true");
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
        log.info("loading non-reloadable mail messages resources");
        return messageSource;
    }

}
