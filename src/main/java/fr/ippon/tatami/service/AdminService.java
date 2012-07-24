package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Domain;
import fr.ippon.tatami.repository.DomainRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.Collection;

/**
 * Administration service. Only users with the "admin" role should access it.
 *
 * @author Julien Dubois
 */
@Service
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminService {

    @Inject
    private DomainRepository domainRepository;

    public Collection<Domain> getAllDomains() {
        return domainRepository.getAllDomains();
    }
}
