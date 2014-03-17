package fr.ippon.tatami.config;

import fr.ippon.tatami.web.syndic.SyndicView;
import org.apache.commons.lang.CharEncoding;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.*;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.env.Environment;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.servlet.view.ContentNegotiatingViewResolver;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.UrlBasedViewResolver;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

@Configuration
@ComponentScan("fr.ippon.tatami.web")
@EnableWebMvc
@PropertySource({"classpath:/META-INF/tatami/tatami.properties",
        "classpath:/META-INF/tatami/customization.properties"})
@ImportResource("classpath:META-INF/spring/applicationContext-metrics.xml")
public class DispatcherServletConfig extends WebMvcConfigurerAdapter {

    private final Logger log = LoggerFactory.getLogger(DispatcherServletConfig.class);

    @Inject
    private Environment env;

    @Bean
    public ViewResolver ContentNegotiatingViewResolver() {
        log.debug("Configuring the ContentNegotiatingViewResolver");
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
    public SyndicView syndicView() {
        return new SyndicView();
    }

    @Bean
    public SessionLocaleResolver localeResolver() {
        return new SessionLocaleResolver();
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        log.debug("Configuring localeChangeInterceptor");
        LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("language");
        return localeChangeInterceptor;
    }

    @Bean
    public MessageSource messageSource() {
        log.debug("Loading MessageSources");
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("/WEB-INF/messages/messages");
        messageSource.setDefaultEncoding(CharEncoding.UTF_8);
        if ("true".equals(env.getProperty("tatami.message.reloading.enabled"))) {
            messageSource.setCacheSeconds(1);
        }
        return messageSource;
    }

    @Bean
    public MultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        Long maxSize = Long.parseLong(env.getProperty("file.max.size"));
        multipartResolver.setMaxUploadSize(maxSize); // 10 Mo max file size by default
        return multipartResolver;
    }

    @Bean
    public RequestMappingHandlerMapping requestMappingHandlerMapping() {
        log.debug("Creating requestMappingHandlerMapping");
        RequestMappingHandlerMapping requestMappingHandlerMapping = new RequestMappingHandlerMapping();
        requestMappingHandlerMapping.setUseSuffixPatternMatch(false);
        Object[] interceptors = {localeChangeInterceptor()};
        requestMappingHandlerMapping.setInterceptors(interceptors);
        return requestMappingHandlerMapping;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.debug("Adding static resource handlers");

        registry.addResourceHandler("/static-wro4j/" + env.getProperty("tatami.version") + "/**")
                .addResourceLocations("/WEB-INF/generated-wro4j/")
                .setCachePeriod(60 * 60 * 24 * 30);

        registry.addResourceHandler("/css/**")
                .addResourceLocations("/css/")
                .setCachePeriod(60 * 60 * 24 * 30);

        registry.addResourceHandler("/static/" + env.getProperty("tatami.version") + "/**")
                .addResourceLocations("/js/")
                .setCachePeriod(60 * 60 * 24 * 30);
    }

    @Override
    public void configureHandlerExceptionResolvers(List<HandlerExceptionResolver> exceptionResolvers) {
        exceptionResolvers.add(new HandlerExceptionResolver() {

            @Override
            public ModelAndView resolveException(HttpServletRequest request,
                                                 HttpServletResponse response,
                                                 Object handler,
                                                 Exception ex) {
                try {
                    if (log.isErrorEnabled()) {
                        log.error("An error has occured : " + ex.getMessage());
                        ex.printStackTrace();
                    }
                    response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    return new ModelAndView();
                } catch (Exception handlerException) {
                    log.warn("Handling of [" + ex.getClass().getName() + "] resulted in Exception", handlerException);
                }
                return null;
            }
        });
    }
}
