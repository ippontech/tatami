package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.DomainConfiguration;

/**
 * The DomainConfiguraiton Repository.
 *
 * @author Julien Dubois
 */
public interface DomainConfigurationRepository {

    void updateDomainConfiguration(DomainConfiguration domainConfiguration);

    DomainConfiguration findDomainConfigurationByDomain(String domain);
}
