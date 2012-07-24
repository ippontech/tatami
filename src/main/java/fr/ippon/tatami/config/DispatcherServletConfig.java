package fr.ippon.tatami.config;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.env.Environment;
import org.springframework.mobile.device.DeviceResolverHandlerInterceptor;
import org.springframework.mobile.device.site.SitePreferenceHandlerInterceptor;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import org.springframework.web.servlet.mvc.support.ControllerClassNameHandlerMapping;
import org.springframework.web.servlet.view.BeanNameViewResolver;
import org.springframework.web.servlet.view.ContentNegotiatingViewResolver;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.UrlBasedViewResolver;
import org.springframework.web.servlet.view.json.MappingJacksonJsonView;

import javax.inject.Inject;
import java.util.*;

@Configuration
@ComponentScan("fr.ippon.tatami.web")
@EnableWebMvc
@PropertySource(value = "classpath:/META-INF/tatami/tatami.properties")
public class DispatcherServletConfig extends WebMvcConfigurerAdapter {

    @Inject
    private Environment env;

    @Bean
    public ViewResolver ContentNegotiatingViewResolver() {
        ContentNegotiatingViewResolver viewResolver = new ContentNegotiatingViewResolver();

        Map<String, String> mediaTypes = new HashMap<String, String>();
        mediaTypes.put("html", "text/html");
        mediaTypes.put("json", "application/json");
        viewResolver.setMediaTypes(mediaTypes);

        List<ViewResolver> viewResolvers = new ArrayList<ViewResolver>();

        UrlBasedViewResolver urlBasedViewResolver = new UrlBasedViewResolver();
        urlBasedViewResolver.setViewClass(JstlView.class);
        urlBasedViewResolver.setPrefix("/WEB-INF/pages/");
        urlBasedViewResolver.setSuffix(".jsp");
        viewResolvers.add(urlBasedViewResolver);

        viewResolver.setViewResolvers(viewResolvers);

        List<View> defaultViews = new ArrayList<View>();
        defaultViews.add(new MappingJacksonJsonView());
        viewResolver.setDefaultViews(defaultViews);

        return viewResolver;
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
        if ("true".equals(env.getProperty("tatami.message.reloading.enabled"))) {
            messageSource.setCacheSeconds(1);
        }
        return messageSource;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/" + env.getProperty("tatami.version") + "/**")
                .addResourceLocations("/WEB-INF/generated-wro4j/")
                .setCachePeriod(60*60*24*30);
    }
}
