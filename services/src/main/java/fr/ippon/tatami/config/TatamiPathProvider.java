package fr.ippon.tatami.config;

import springfox.documentation.PathProvider;
import springfox.documentation.spring.web.paths.RelativePathProvider;

import javax.servlet.ServletContext;

/**
 * Created by lnorregaard on 03/12/15.
 */
public class TatamiPathProvider extends RelativePathProvider {
    public TatamiPathProvider(ServletContext servletContext) {
        super(servletContext);
    }

    @Override
    protected String applicationPath() {
        return "/tatami/";
    }
}
