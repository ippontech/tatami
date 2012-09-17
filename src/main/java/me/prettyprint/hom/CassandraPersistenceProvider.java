package me.prettyprint.hom;

import org.apache.openjpa.persistence.EntityManagerFactoryImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.EntityManagerFactory;
import javax.persistence.spi.PersistenceProvider;
import javax.persistence.spi.PersistenceUnitInfo;
import java.util.Map;

/**
 * This is a temporary hack : this class is needed at startup by the HOM configuration,
 * but is not provided (and anyway HOM doesn't use it...).
 */
public class CassandraPersistenceProvider implements PersistenceProvider {
    private static Logger log = LoggerFactory.getLogger(CassandraPersistenceProvider.class);

    private Map<String, Object> defProperties;

    public CassandraPersistenceProvider() {
    }

    public CassandraPersistenceProvider(Map<String, Object> map) {
        this.defProperties = map;
    }

    @Override
    public EntityManagerFactory createContainerEntityManagerFactory(
            PersistenceUnitInfo info, Map map) {
        if (log.isDebugEnabled()) {
            log.debug("creating EntityManagerFactory {} with properties {} ", "null", map);
        }
        return null;
    }

    @Override
    public EntityManagerFactory createEntityManagerFactory(String emName, Map map) {
        if (log.isDebugEnabled()) {
            log.debug("creating EntityManagerFactory {} with properties {} ", emName, map);
        }
        if (map == null || map.isEmpty()) {
            return new EntityManagerFactoryImpl();
        }
        return new EntityManagerFactoryImpl();
    }

}
