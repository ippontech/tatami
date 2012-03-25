package fr.ippon.tatami.config;

import fr.ippon.tatami.web.monitoring.MonitoringFilter;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.*;
import java.util.EnumSet;

public class WebInitializer implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {

        AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
        rootContext.register(ApplicationConfiguration.class);
        rootContext.refresh();

        servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, rootContext);


        AnnotationConfigWebApplicationContext dispatcherServletConfig = new AnnotationConfigWebApplicationContext();
        dispatcherServletConfig.setParent(rootContext);
        dispatcherServletConfig.register(DispatcherServletConfig.class);

        ServletRegistration.Dynamic dispatcherServlet = servletContext.addServlet("dispatcher", new DispatcherServlet(dispatcherServletConfig));
        dispatcherServlet.addMapping("/tatami/*");
        dispatcherServlet.setLoadOnStartup(1);


        FilterRegistration.Dynamic springSecurityFilter = servletContext.addFilter("springSecurityFilterChain", new DelegatingFilterProxy());
        EnumSet<DispatcherType> disps = EnumSet.of(DispatcherType.REQUEST, DispatcherType.FORWARD);
        springSecurityFilter.addMappingForServletNames(disps, true, "dispatcher");

        FilterRegistration.Dynamic monitoringFilter = servletContext.addFilter("monitoringFilter", new MonitoringFilter());
        monitoringFilter.addMappingForUrlPatterns(disps, true, "/*");
    }
}
