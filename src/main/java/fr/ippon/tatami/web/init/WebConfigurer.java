package fr.ippon.tatami.web.init;

import com.yammer.metrics.reporting.AdminServlet;
import com.yammer.metrics.web.DefaultWebappMetricsFilter;
import fr.ippon.tatami.config.ApplicationConfiguration;
import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.config.DispatcherServletConfig;
import org.atmosphere.cache.UUIDBroadcasterCache;
import org.atmosphere.cpr.AtmosphereServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.*;
import java.util.EnumSet;

/**
 * Configuration of web application with Servlet 3.0 APIs.<br>
 * <p/>
 * This class is to be used as a standard listener within a web.xml.
 * To optimise startup time, you can completely disable classpath scanning :
 * <ul>
 * <li>with metadata-complete="true" global attribute
 * <li>with an empty &lt;absolute-ordering&gt; ( it's necessary with Jetty at least <b>TODO</b> : test with other
 * containers )
 * </ul>
 * <p/>
 * See web.xml :
 * <p/>
 * <pre>
 *   &lt;web-app xmlns="http://java.sun.com/xml/ns/javaee"
 *          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 *          xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
 *          version="3.0"
 *          metadata-complete="true">
 *
 * 	&lt;!--
 * 	Remove classpath scanning (from servlet 3.0) in order to speed jetty startup :
 * 	metadata-complete="true" above + empty absolute ordering below
 * 	-->
 * 	&lt;absolute-ordering>
 * 		&lt;!--
 * 		 Empty absolute ordering is necessary to completely desactivate classpath scanning
 * 		  -->
 * 	&lt;/absolute-ordering>
 *
 *     &lt;display-name>Tatami&lt;/display-name>
 *
 *     &lt;!-- All the Servlets and Filters are configured by this ServletContextListener : -->
 *     &lt;listener>
 *         &lt;listener-class>fr.ippon.tatami.web.init.WebConfigurer&lt;/listener-class>
 *     &lt;/listener>
 *
 * &lt;/web-app>
 * </pre>
 *
 * @author Fabien Arrault
 */
public class WebConfigurer implements ServletContextListener {

    private final Logger log = LoggerFactory.getLogger(WebConfigurer.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext servletContext = sce.getServletContext();
        log.info("Web application configuration");

        log.debug("Configuring Spring root application context");
        AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
        rootContext.register(ApplicationConfiguration.class);
        rootContext.refresh();

        servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, rootContext);

        EnumSet<DispatcherType> disps = EnumSet.of(DispatcherType.REQUEST, DispatcherType.FORWARD, DispatcherType.ASYNC);

        log.debug("Configuring Spring Web application context");
        AnnotationConfigWebApplicationContext dispatcherServletConfig = new AnnotationConfigWebApplicationContext();
        dispatcherServletConfig.setParent(rootContext);
        dispatcherServletConfig.register(DispatcherServletConfig.class);

        log.debug("Registering Spring MVC Servlet");
        ServletRegistration.Dynamic dispatcherServlet = servletContext.addServlet("dispatcher", new DispatcherServlet(
                dispatcherServletConfig));
        dispatcherServlet.addMapping("/tatami/*");
        dispatcherServlet.setLoadOnStartup(1);

        log.debug("Registering Spring Security Filter");
        FilterRegistration.Dynamic springSecurityFilter = servletContext.addFilter("springSecurityFilterChain",
                new DelegatingFilterProxy());

        springSecurityFilter.setAsyncSupported(true);

        initAtmosphereServlet(servletContext);

        Environment env = rootContext.getBean(Environment.class);
        if (env.acceptsProfiles(Constants.SPRING_PROFILE_METRICS)) {
            initMetricsServlet(servletContext, disps, dispatcherServlet);
            springSecurityFilter.addMappingForServletNames(disps, true, "dispatcher", "atmosphereServlet", "metricsAdminServlet");
        } else {
            springSecurityFilter.addMappingForServletNames(disps, true, "dispatcher", "atmosphereServlet");
        }

        log.debug("Web application fully configured");
    }

    private void initMetricsServlet(ServletContext servletContext, EnumSet<DispatcherType> disps, ServletRegistration.Dynamic dispatcherServlet) {
        log.debug("Setting Metrics profile for the Web ApplicationContext");

        log.debug("Registering Metrics Filter");
        FilterRegistration.Dynamic metricsFilter = servletContext.addFilter("webappMetricsFilter",
                new DefaultWebappMetricsFilter());
        metricsFilter.addMappingForUrlPatterns(disps, true, "/*");

        log.debug("Registering Metrics Admin Servlet");
        ServletRegistration.Dynamic metricsAdminServlet =
                servletContext.addServlet("metricsAdminServlet", new AdminServlet());
        metricsAdminServlet.addMapping("/metrics/*");
        dispatcherServlet.setLoadOnStartup(2);
    }

    private void initAtmosphereServlet(ServletContext servletContext) {
        log.debug("Registering Atmosphere Servlet");
        ServletRegistration.Dynamic atmosphereServlet =
                servletContext.addServlet("atmosphereServlet", new AtmosphereServlet());

        atmosphereServlet.setAsyncSupported(true);
        atmosphereServlet.setInitParameter("org.atmosphere.cpr.packages", "fr.ippon.tatami.web.atmosphere");
        atmosphereServlet.setInitParameter("org.atmosphere.cpr.broadcasterCacheClass", UUIDBroadcasterCache.class.getName());
        atmosphereServlet.setInitParameter("org.atmosphere.cpr.broadcaster.shareableThreadPool", "true");
        atmosphereServlet.setInitParameter("org.atmosphere.cpr.broadcaster.maxProcessingThreads", "10");
        atmosphereServlet.setInitParameter("org.atmosphere.cpr.broadcaster.maxAsyncWriteThreads", "10");

        atmosphereServlet.setLoadOnStartup(3);
        atmosphereServlet.addMapping("/realtime/*");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        log.info("Destroying Web application");
        WebApplicationContext ac = WebApplicationContextUtils.getRequiredWebApplicationContext(sce.getServletContext());
        AnnotationConfigWebApplicationContext gwac = (AnnotationConfigWebApplicationContext) ac;
        gwac.close();
        log.debug("Web application destroyed");
    }

}
