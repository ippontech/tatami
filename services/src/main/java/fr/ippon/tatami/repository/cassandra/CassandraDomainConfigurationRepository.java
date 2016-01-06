package fr.ippon.tatami.repository.cassandra;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;


import com.datastax.driver.core.BatchStatement;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.Session;
import com.datastax.driver.mapping.Mapper;
import com.datastax.driver.mapping.MappingManager;
import fr.ippon.tatami.domain.Domain;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.validation.ContraintsUserCreation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import fr.ippon.tatami.domain.DomainConfiguration;
import fr.ippon.tatami.repository.DomainConfigurationRepository;

import java.util.HashSet;
import java.util.Set;

/**
 * Cassandra implementation of the DomainConfiguration repository.
 *
 * @author Julien Dubois
 */

@Repository
public class CassandraDomainConfigurationRepository implements DomainConfigurationRepository {

    private final Logger log = LoggerFactory.getLogger(CassandraDomainConfigurationRepository.class);

    @Inject
    private Session session;

    private Mapper<DomainConfiguration> mapper;

    private PreparedStatement findOneByDomainStmt;


    private PreparedStatement deleteByLoginStmt;

    @PostConstruct
    public void init() {
        mapper = new MappingManager(session).mapper(DomainConfiguration.class);
        findOneByDomainStmt = session.prepare(
                "SELECT * " +
                        "FROM domainConfiguration " +
                        "WHERE domain = :domain");
        deleteByLoginStmt = session.prepare("DELETE FROM user " +
                "WHERE login = :login");
    }

    @Override
    public void updateDomainConfiguration(DomainConfiguration domainConfiguration) {
        setDefaultValues(domainConfiguration);
        BatchStatement batch = new BatchStatement();
        batch.add(mapper.saveQuery(domainConfiguration));
        session.execute(batch);
    }

    @Override
    public DomainConfiguration findDomainConfigurationByDomain(String domain) {
        DomainConfiguration domainConfiguration = null;
        if (domainConfiguration == null) {
            domainConfiguration = new DomainConfiguration();
            domainConfiguration.setDomain(domain);
            setDefaultValues(domainConfiguration);
        }

//        try {
//            domainConfiguration = em.find(DomainConfiguration.class, domain);
//        } catch (Exception e) {
//
//            log.debug("Exception while looking for domain {} : {}", domain, e.toString());
//
//            return null;
//        }
//        if (domainConfiguration == null) {
//            domainConfiguration = new DomainConfiguration();
//            domainConfiguration.setDomain(domain);
//            setDefaultValues(domainConfiguration);
////            em.persist(domainConfiguration);
//        }
//        if (domain.equals("ippon.fr")) {
//            domainConfiguration.setSubscriptionLevel(DomainConfiguration.SubscriptionAndStorageSizeOptions.IPPONSUSCRIPTION);
//            domainConfiguration.setStorageSize(DomainConfiguration.SubscriptionAndStorageSizeOptions.IPPONSIZE);
//        }
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
