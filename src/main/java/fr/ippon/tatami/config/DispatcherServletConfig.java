package fr.ippon.tatami.config;

import fr.ippon.tatami.web.syndic.SyndicView;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.env.Environment;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import org.springframework.web.servlet.view.ContentNegotiatingViewResolver;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.UrlBasedViewResolver;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

@Configuration
@ComponentScan("fr.ippon.tatami.web")
@EnableWebMvc
@PropertySource({"classpath:/META-INF/tatami/tatami.properties"})
public class DispatcherServletConfig extends WebMvcConfigurerAdapter {

    @Inject
    private Environment env;

    @Bean
    public ViewResolver ContentNegotiatingViewResolver() {
        ContentNegotiatingViewResolver viewResolver = new ContentNegotiatingViewResolver();
        List<ViewResolver> viewResolvers = new ArrayList<ViewResolver>();

        UrlBasedViewResolver urlBasedViewResolver = new UrlBasedViewResolver();
        urlBasedViewResolver.setViewClass(JstlView.class);
        urlBasedViewResolver.setPrefix("/WEB-INF/pages/");
        urlBasedViewResolver.setSuffix(".jsp");
        viewResolvers.add(urlBasedViewResolver);
        
        viewResolver.setViewResolvers(viewResolvers);

        List<View> defaultViews = new ArrayList<View>();
        defaultViews.add(new MappingJackson2JsonView());
        defaultViews.add(syndicView());
        viewResolver.setDefaultViews(defaultViews);

        return viewResolver;
    }
    
    @Bean
    public SyndicView syndicView()
    {
        return new SyndicView();
    }
    

    @Bean
    public SessionLocaleResolver localeResolver() {
        SessionLocaleResolver resolver = new SessionLocaleResolver();
        return resolver;
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("language");
        return localeChangeInterceptor;
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

    @Bean
    public MultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        multipartResolver.setMaxUploadSize(10000000); // 10 Mo max file size
        return multipartResolver;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
        super.addInterceptors(registry);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/" + env.getProperty("tatami.version") + "/**")
                .addResourceLocations("/WEB-INF/generated-wro4j/")
                .setCachePeriod(60 * 60 * 24 * 30);
    }
}
