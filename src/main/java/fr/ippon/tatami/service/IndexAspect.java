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
import fr.ippon.tatami.domain.User;


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
    	log.debug("creating an user to the index...");
    	
    	if(null!=pjp.getArgs()){
			for(Object o : pjp.getArgs()){
				
				User user = (User) o;
				log.debug("--------------> adding a user to the index... " + user.getLogin());
				indexService.addUser(user);
				
			}
		}
		
		Object p = pjp.proceed();
		return p;
	}
    
    @Around("execution(* fr.ippon.tatami.service.UserService.updateUser(..))")
   	public Object updateUserToIndex(ProceedingJoinPoint pjp) throws Throwable {
   		log.debug("updating an user to the index...");
   		
   		if(null!=pjp.getArgs()){
			for(Object o : pjp.getArgs()){
				
				User user = (User) o;
				log.debug("--------------> updating a user to the index... " + user.getLogin());
				indexService.removeUser(user);
				indexService.addUser(user);
			}
		}
   		
   		Object p = pjp.proceed();
   		return p;
   	}
    
    @Around("execution(* fr.ippon.tatami.service.UserService.removeUser(..))")
   	public Object removeUserToIndex(ProceedingJoinPoint pjp) throws Throwable {
   		log.debug("removing an user to the index...");
   		
   		if(null!=pjp.getArgs()){
			for(Object o : pjp.getArgs()){
				
				User user = (User) o;
				log.debug("--------------> removing a user to the index... " + user.getLogin());
				indexService.removeUser(user);
			}
		}
   		
   		Object p = pjp.proceed();
   		return p;
   	}
}
