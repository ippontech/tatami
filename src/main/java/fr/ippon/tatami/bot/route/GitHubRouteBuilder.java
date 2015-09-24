package fr.ippon.tatami.bot.route;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//@Component ==> disabling component scanning as we create instances of this builder programmatically
public class GitHubRouteBuilder extends SourceRouteBuilderBase {

    private static final Logger log = LoggerFactory.getLogger(GitHubRouteBuilder.class);

    @Override
    public void configure() {

//      log.info("Configuring Github support");
        //https://github.com/eclipse/egit-github/tree/master/org.eclipse.egit.github.core
    }
}
