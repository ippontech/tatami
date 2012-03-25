package fr.ippon.tatami.web.init;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.ServletException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import fr.ippon.tatami.config.WebInitializer;

/**
 * Alternative to SpringServletContainerInitializer (which allow web.xml-less configuration using Servlet 3.0 ServletContainerInitializer).<br>
 * <b>This class IS NOT used in the default packaging of Tatami</b>
 * <p>
 * This class allows to reuse directly the org.springframework.web.WebApplicationInitializer of Tatami without the overhead of classpath scanning.<br>
 * (When using SpringServletContainerInitializer, the servlet container is asked to scan for all class implementing 
 * WebApplicationInitializer in the whole class realm which may be very time consuming ). 
 * <p>
 * This class is to be used as a standard listener within a web.xml that completely disabled classpath scanning : 
 * <ul>
 * 	<li> with metadata-complete="true" global attribute
 *  <li> with an empty &lt;absolute-ordering&gt;  ( it's necessary with Jetty at least <b>TODO</b> : test with other containers ) 
 * </ul>
 * 
 * See src/main/webxmlAlternatives/web.xml :
 * 
 <pre>
  &lt;web-app xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
         version="3.0"
         metadata-complete="true">

	&lt;!-- 
	Remove classpath scanning (from servlet 3.0) in order to speed jetty startup :
	metadata-complete="true" above + empty absolute ordering below
	-->
	&lt;absolute-ordering>
		&lt;!--
		 Empty absolute ordering is necessary to completely desactivate classpath scanning
		  -->
	&lt;/absolute-ordering>

    &lt;display-name>Tatami&lt;/display-name>

    &lt;!-- All the Servlets and Filters are configured by this ServletContextListener : -->
    &lt;listener>
        &lt;listener-class>fr.ippon.tatami.web.init.WebConfigurer&lt;/listener-class>
    &lt;/listener>
    
&lt;/web-app>
</pre>
 * 
 * @author Fabien Arrault
 */
public class WebConfigurer implements ServletContextListener {

	private final Log log = LogFactory.getLog(WebConfigurer.class);
	
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		WebInitializer webInitializer = new WebInitializer();
		log.info("Configuring Tatami explicitly calling "+webInitializer.getClass().getName() +
				" (and bypassing SpringServletContainerInitializer) ");
		try {
			webInitializer.onStartup(sce.getServletContext());
		} catch (ServletException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		// nothing to do
	}

}
