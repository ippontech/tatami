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
 * @author adminIsUnstoppable
 *
 */
@Aspect
@Component
public class IndexAspect {

    private final Log log = LogFactory.getLog(IndexAspect.class);

    @Inject
    private IndexService indexService;

    public IndexAspect() {
    	if (log.isDebugEnabled()) {
    		log.debug(IndexAspect.class.getSimpleName() + " instantiated");
    	}
	}
    
    @Around("execution(* fr.ippon.tatami.service.TimelineService.postTweet(..))")
    public Object addTweetToIndex(ProceedingJoinPoint pjp) throws Throwable {
		Object p = pjp.proceed();
		
		if (p != null) {
			Tweet tweet = (Tweet) p;
			log.debug("adding a tweet to the index... " + tweet.getContent());
			indexService.addTweet(tweet);
		}
		
		return p;
	}

    @Around("execution(* fr.ippon.tatami.service.UserService.createUser(..))")
	public Object addUserToIndex(ProceedingJoinPoint pjp) throws Throwable {
		log.debug("adding an user to the index...");
		Object p = pjp.proceed();
		return p;
	}
	
	
}
