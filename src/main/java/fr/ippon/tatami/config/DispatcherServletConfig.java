package fr.ippon.tatami.config;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.mobile.device.DeviceResolverHandlerInterceptor;
import org.springframework.mobile.device.site.SitePreferenceHandlerInterceptor;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import org.springframework.web.servlet.mvc.support.ControllerClassNameHandlerMapping;
import org.springframework.web.servlet.view.BeanNameViewResolver;
import org.springframework.web.servlet.view.ContentNegotiatingViewResolver;
import org.springframework.web.servlet.view.UrlBasedViewResolver;
import org.springframework.web.servlet.view.json.MappingJacksonJsonView;
import org.springframework.web.servlet.view.tiles2.TilesConfigurer;
import org.springframework.web.servlet.view.tiles2.TilesView;

import java.util.*;

@Configuration
@ComponentScan("fr.ippon.tatami.web")
@EnableWebMvc
@PropertySource(value = "classpath:/META-INF/tatami/tatami.properties")
public class DispatcherServletConfig extends WebMvcConfigurerAdapter {

    @Bean
    public ViewResolver ContentNegotiatingViewResolver() {
        ContentNegotiatingViewResolver viewResolver = new ContentNegotiatingViewResolver();

        Map<String, String> mediaTypes = new HashMap<String, String>();
        mediaTypes.put("html", "text/html");
        mediaTypes.put("json", "application/json");
        viewResolver.setMediaTypes(mediaTypes);

        List<ViewResolver> viewResolvers = new ArrayList<ViewResolver>();
        viewResolvers.add(new BeanNameViewResolver());

        UrlBasedViewResolver urlBasedViewResolver = new UrlBasedViewResolver();
        urlBasedViewResolver.setViewClass(TilesView.class);
        viewResolvers.add(urlBasedViewResolver);

        viewResolver.setViewResolvers(viewResolvers);

        List<View> defaultViews = new ArrayList<View>();
        defaultViews.add(new MappingJacksonJsonView());
        viewResolver.setDefaultViews(defaultViews);

        return viewResolver;
    }

    /**
     * Configures Tiles at application startup.
     */
    @Bean
    public TilesConfigurer tilesConfigurer() {
        TilesConfigurer configurer = new TilesConfigurer();
        configurer.setDefinitions(new String[]{
                "/WEB-INF/layouts/tiles.xml"
        });
        configurer.setCheckRefresh(true);
        return configurer;
    }

    @Bean
    public SessionLocaleResolver localeChangeInterceptor() {
        SessionLocaleResolver resolver = new SessionLocaleResolver();
        Locale locale = new Locale("en");
        resolver.setDefaultLocale(locale);
        return resolver;
    }

    @Bean
    public ControllerClassNameHandlerMapping controllerClassNameHandlerMapping() {
        ControllerClassNameHandlerMapping mapping = new ControllerClassNameHandlerMapping();
        LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("language");
        mapping.setInterceptors(new Object[]{localeChangeInterceptor});
        return mapping;
    }

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("/WEB-INF/messages/messages");
        messageSource.setCacheSeconds(1);
        return messageSource;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new DeviceResolverHandlerInterceptor());
        registry.addInterceptor(new SitePreferenceHandlerInterceptor());
    }
}
