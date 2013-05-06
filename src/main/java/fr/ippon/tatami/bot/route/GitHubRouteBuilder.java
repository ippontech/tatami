package fr.ippon.tatami.bot.route;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

//@Component ==> disabling component scanning as we create instances of this builder programmatically
public class GitHubRouteBuilder extends SourceRouteBuilderBase {

    private static final Log log = LogFactory.getLog(GitHubRouteBuilder.class);

    @Override
    public void configure() {

//      log.info("Configuring Github support");
      //https://github.com/eclipse/egit-github/tree/master/org.eclipse.egit.github.core
    }
}
