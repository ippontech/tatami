package fr.ippon.tatami.config;

import com.yammer.metrics.ehcache.InstrumentedEhcache;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Ehcache;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.inject.Inject;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final Log log = LogFactory.getLog(CacheConfiguration.class);

    @Inject
    private Environment env;

    @Bean
    public CacheManager cacheManager() {

        net.sf.ehcache.CacheManager cacheManager = new net.sf.ehcache.CacheManager();

        if ("true".equals(env.getProperty("tatami.metrics.enabled"))) {
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
        }
        EhCacheCacheManager ehCacheManager = new EhCacheCacheManager();
        ehCacheManager.setCacheManager(cacheManager);
        return ehCacheManager;
    }
}
