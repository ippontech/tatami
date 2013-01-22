package fr.ippon.tatami.plugin.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.PropertySource;

@Configuration
//@PropertySource({"classpath:/META-INF/tatami/tatamiXXXX.properties"})
@ComponentScan(basePackages = {
        "fr.ippon.tatami.plugin.service"})
@ImportResource({"classpath*:META-INF/spring/tatami-extension.xml"})
public class PluginsConfiguration {

}
