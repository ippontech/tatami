/**
 * 
 */
package fr.ippon.tatami.service;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import fr.ippon.tatami.domain.Tweet;


/**
 * Not used right now
 * @author dmartin
 *
 */
@Aspect
//@Component
public class IndexAspect {

    private static final Log LOG = LogFactory.getLog(IndexAspect.class);

    @Inject
    private IndexService indexService;

    public IndexAspect() {
    	if (LOG.isDebugEnabled()) {
    		LOG.debug(IndexAspect.class.getSimpleName() + " instantiated");
    	}
	}

    @Around("execution(* fr.ippon.tatami.service.TimelineService.postTweet(..))")
    public Object addTweetToIndex(final ProceedingJoinPoint pjp) throws Throwable {
    	final Object p = pjp.proceed();

		if (p != null) {
			final Tweet tweet = (Tweet) p;
			indexService.addTweet(tweet);
		}

		return p;
	}

    @Around("execution(* fr.ippon.tatami.service.UserService.createUser(..))")
	public Object addUserToIndex(ProceedingJoinPoint pjp) throws Throwable {
		LOG.debug("Adding an user to the index...");
		final Object p = pjp.proceed();
		// TODO add this to the index
		return p;
	}

}
