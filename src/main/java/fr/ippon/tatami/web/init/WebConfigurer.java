package fr.ippon.tatami.web.init;

import fr.ippon.tatami.config.ApplicationConfiguration;
import fr.ippon.tatami.config.DispatcherServletConfig;
import fr.ippon.tatami.web.monitoring.MonitoringFilter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.mobile.device.DeviceResolverRequestFilter;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
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

    private final Log log = LogFactory.getLog(WebConfigurer.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext servletContext = sce.getServletContext();
        this.log.info("Configuring servlets and filters from a ServletContextListener referenced by web.xml");

        AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
        rootContext.register(ApplicationConfiguration.class);
        rootContext.refresh();

        servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, rootContext);

        AnnotationConfigWebApplicationContext dispatcherServletConfig = new AnnotationConfigWebApplicationContext();
        dispatcherServletConfig.setParent(rootContext);
        dispatcherServletConfig.register(DispatcherServletConfig.class);

        ServletRegistration.Dynamic dispatcherServlet = servletContext.addServlet("dispatcher", new DispatcherServlet(
                dispatcherServletConfig));
        dispatcherServlet.addMapping("/tatami/*");
        dispatcherServlet.setLoadOnStartup(2);

        FilterRegistration.Dynamic springSecurityFilter = servletContext.addFilter("springSecurityFilterChain",
                new DelegatingFilterProxy());
        EnumSet<DispatcherType> disps = EnumSet.of(DispatcherType.REQUEST, DispatcherType.FORWARD);
        springSecurityFilter.addMappingForServletNames(disps, true, "dispatcher");

        FilterRegistration.Dynamic monitoringFilter = servletContext.addFilter("monitoringFilter",
                new MonitoringFilter());
        monitoringFilter.addMappingForUrlPatterns(disps, true, "/*");

        FilterRegistration.Dynamic deviceResolverHandlerFilter = servletContext.addFilter("deviceResolverRequestFilter",
                new DeviceResolverRequestFilter());
        deviceResolverHandlerFilter.addMappingForUrlPatterns(disps, true, "/*");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // TODO : close ApplicationContexts
    }

}
