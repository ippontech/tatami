package fr.ippon.tatami.repository.cassandra;

import javax.inject.Inject;

import me.prettyprint.hom.EntityManagerImpl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import fr.ippon.tatami.domain.DomainConfiguration;
import fr.ippon.tatami.repository.DomainConfigurationRepository;

/**
 * Cassandra implementation of the DomainConfiguration repository.
 *
 * @author Julien Dubois
 */

@Repository
public class CassandraDomainConfigurationRepository implements DomainConfigurationRepository {

    private final Logger log = LoggerFactory.getLogger(CassandraDomainConfigurationRepository.class);
    
    @Inject
    private EntityManagerImpl em;

    @Override
    public void updateDomainConfiguration(DomainConfiguration domainConfiguration) {
        setDefaultValues(domainConfiguration);
        em.persist(domainConfiguration);
    }

    @Override
    public DomainConfiguration findDomainConfigurationByDomain(String domain) {
        DomainConfiguration domainConfiguration;
        try {
            domainConfiguration = em.find(DomainConfiguration.class, domain);
        } catch (Exception e) {

            log.debug("Exception while looking for domain {} : {}", domain, e.toString());

            return null;
        }
        if (domainConfiguration == null) {
            domainConfiguration = new DomainConfiguration();
            domainConfiguration.setDomain(domain);
            setDefaultValues(domainConfiguration);
            em.persist(domainConfiguration);
        }
        if (domain.equals("ippon.fr")) {
            domainConfiguration.setSubscriptionLevel(DomainConfiguration.SubscriptionAndStorageSizeOptions.IPPONSUSCRIPTION);
            domainConfiguration.setStorageSize(DomainConfiguration.SubscriptionAndStorageSizeOptions.IPPONSIZE);
        }
        return domainConfiguration;
    }

    private void setDefaultValues(DomainConfiguration domainConfiguration) {
        if (domainConfiguration.getStorageSize() == null) {
            domainConfiguration.setStorageSize(DomainConfiguration.SubscriptionAndStorageSizeOptions.BASICSIZE);
        }
        if (domainConfiguration.getSubscriptionLevel() == null) {
            domainConfiguration.setSubscriptionLevel(DomainConfiguration.SubscriptionAndStorageSizeOptions.BASICSUSCRIPTION);
        }
    }
}
