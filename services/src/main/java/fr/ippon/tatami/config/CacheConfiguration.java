package fr.ippon.tatami.config;

import com.yammer.metrics.ehcache.InstrumentedEhcache;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Ehcache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.annotation.PreDestroy;
import javax.inject.Inject;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final Logger log = LoggerFactory.getLogger(CacheConfiguration.class);

    private net.sf.ehcache.CacheManager cacheManager;

    @Inject
    private Environment env;

    @PreDestroy
    public void destroy() {
        log.info("Closing Ehcache");
        cacheManager.shutdown();
    }

    @Bean
    public CacheManager cacheManager() {
        cacheManager = new net.sf.ehcache.CacheManager();

        if (env.acceptsProfiles(Constants.SPRING_PROFILE_METRICS)) {
            log.debug("Ehcache Metrics monitoring enabled");

            Cache statusCache = cacheManager.getCache("status-cache");
            Ehcache decoratedStatusCache = InstrumentedEhcache.instrument(statusCache);
            cacheManager.replaceCacheWithDecoratedCache(statusCache, decoratedStatusCache);

            Cache userCache = cacheManager.getCache("user-cache");
            Ehcache decoratedUserCache = InstrumentedEhcache.instrument(userCache);
            cacheManager.replaceCacheWithDecoratedCache(userCache, decoratedUserCache);

            Cache attachmentCache = cacheManager.getCache("attachment-cache");
            Ehcache decoratedAttachmentCache = InstrumentedEhcache.instrument(attachmentCache);
            cacheManager.replaceCacheWithDecoratedCache(attachmentCache, decoratedAttachmentCache);

            Cache friendsCache = cacheManager.getCache("friends-cache");
            Ehcache decoratedFriendsCache = InstrumentedEhcache.instrument(friendsCache);
            cacheManager.replaceCacheWithDecoratedCache(friendsCache, decoratedFriendsCache);

            Cache followersCache = cacheManager.getCache("followers-cache");
            Ehcache decoratedFollowersCache = InstrumentedEhcache.instrument(followersCache);
            cacheManager.replaceCacheWithDecoratedCache(followersCache, decoratedFollowersCache);

            Cache groupCache = cacheManager.getCache("group-cache");
            Ehcache decoratedGroupCache = InstrumentedEhcache.instrument(groupCache);
            cacheManager.replaceCacheWithDecoratedCache(groupCache, decoratedGroupCache);

            Cache groupUserCache = cacheManager.getCache("group-user-cache");
            Ehcache decoratedGroupUserCache = InstrumentedEhcache.instrument(groupUserCache);
            cacheManager.replaceCacheWithDecoratedCache(groupUserCache, decoratedGroupUserCache);
        }
        EhCacheCacheManager ehCacheManager = new EhCacheCacheManager();
        ehCacheManager.setCacheManager(cacheManager);
        return ehCacheManager;
    }
}
